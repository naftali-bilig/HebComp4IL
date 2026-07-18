import { jclockSnapshot } from '../utils/jclock'
import { requestPhoneLocation, sendSnapshot, SUN_TITLE, MOON_TITLE } from '../utils/bridge'
import { createWidget, widget, align, prop, event } from '@zos/ui'
import { getDeviceInfo } from '@zos/device'
import { setPageBrightTime, resetPageBrightTime } from '@zos/display'

const LATITUDE = 31.7768514
const LONGITUDE = 35.2331664
const LOCATION_POLL_MS = 6000
// A relaxed interval makes the gesture reliable on a small round touchscreen.
const LOCAL_DOUBLE_TAP_MS = 650

const BLACK = 0x000000
const BORDER = 0x37444e
const ORBIT_BORDER = 0x4b5963
const TEXT = 0xffffff
const MUTED = 0xd3d3d3
const TITLE = 0x74cdff
const LIVE_TEXT = 0xc5e1f2
const PAUSED_TEXT = 0xffc441
const SUN = 0xffd246
const TRACK = 0x303940
const KNOB = 0x45b7ff
const NOW_BACKGROUND = 0x223a48
const NOW_TEXT = 0x87d2ff
const ERROR = 0xe05858

const WEEKDAYS = ['', 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

function pad(value, size) {
  let result = String(Math.trunc(Math.abs(Number(value) || 0)))
  while (result.length < size) result = `0${result}`
  return result
}

function colorNumber(value, fallback) {
  if (typeof value === 'number') return value
  const normalized = String(value || '').replace('#', '')
  const parsed = parseInt(normalized, 16)
  return Number.isFinite(parsed) ? parsed : fallback
}

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value))
}

function zonedParts(epoch, utcOffsetMinutes) {
  const offset = Number.isFinite(Number(utcOffsetMinutes)) ? Number(utcOffsetMinutes) : 0
  const shifted = new Date(Number(epoch) + offset * 60 * 1000)
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
    millisecond: shifted.getUTCMilliseconds()
  }
}

function civilTimeFromParts(parts) {
  return `${pad(parts.hour, 2)}:${pad(parts.minute, 2)}:${pad(parts.second, 2)}`
}

function normalizedLocation(value) {
  const latitude = Number(value && value.latitude)
  const longitude = Number(value && value.longitude)
  const utcOffsetMinutes = Number(value && value.utcOffsetMinutes)
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) return null
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) return null
  if (!Number.isFinite(utcOffsetMinutes) || utcOffsetMinutes < -14 * 60 || utcOffsetMinutes > 14 * 60) return null
  return {
    latitude,
    longitude,
    utcOffsetMinutes,
    accuracy: Number(value && value.accuracy),
    timeZone: String((value && value.timeZone) || ''),
    mobileLocationEnabled: Boolean(value && value.mobileLocationEnabled),
    updated: !value || value.updated !== false,
    keepScreenOn: Boolean(value && value.keepScreenOn)
  }
}

function moonAsset(snapshot) {
  const monthLength = snapshot.hebrew.monthLength === 29 ? 29 : 30
  const day = clamp(snapshot.hebrew.day, 1, monthLength)
  return `moon/moon_${monthLength}_${pad(day, 2)}.png`
}

function sourcePosition(source, center, radius) {
  const orbit = source && source.orbit ? source.orbit : { x: 0, y: -1 }
  return {
    x: Math.round(center.x + orbit.x * radius),
    y: Math.round(center.y + orbit.y * radius)
  }
}

Page({
  build() {
    const { width, height } = getDeviceInfo()
    const diameter = Math.min(width, height)
    const scale = diameter / 454
    const px = value => Math.round(value * scale)
    const centerX = Math.round(width / 2)
    const centerY = Math.round(height / 2)
    const radius = diameter / 2 - px(5)

    this.width = width
    this.height = height
    this.px = px
    this.centerX = centerX
    this.centerY = centerY
    this.radius = radius
    this.snapshot = null
    this.pausedEpoch = 0
    this.offsetSeconds = 0
    this.statusTimer = null
    this.localTapTimer = null
    this.firstLocalTapAt = 0
    this.locationPollTimer = null
    this.displayPreferenceTimer = null
    this.locationRequestInFlight = false
    this.locationGeneration = 0
    this.desiredLocationMode = 'jerusalem'
    this.locationMode = 'jerusalem'
    this.localTrackingMode = 'jerusalem'
    this.latitude = LATITUDE
    this.longitude = LONGITUDE
    this.timeZone = 'Asia/Jerusalem'
    this.utcOffsetMinutes = -new Date().getTimezoneOffset()
    this.jerusalemUtcOffsetMinutes = this.utcOffsetMinutes
    this.mobileLocationEnabled = false

    const make = (owner, type, params) => owner
      ? owner.createWidget(type, params)
      : createWidget(type, params)

    const fill = (owner, x, y, w, h, color, cornerRadius = 0) => make(owner, widget.FILL_RECT, {
      x, y, w, h, color, radius: cornerRadius
    })

    const text = (owner, x, y, w, h, size, value, color = TEXT) => make(owner, widget.TEXT, {
      x, y, w, h, text: value, text_size: size, color,
      align_h: align.CENTER_H, align_v: align.CENTER_V
    })

    const centeredText = (center, y, w, h, size, value, color = TEXT) => text(
      null,
      Math.round(center - w / 2),
      Math.round(y - h / 2),
      Math.round(w),
      Math.round(h),
      px(size),
      value,
      color
    )

    const outlinedText = (geometry, size, value) => {
      const outline = Math.max(1, px(1))
      ;[[-outline, 0], [outline, 0], [0, -outline], [0, outline]].forEach(([dx, dy]) => {
        const shadow = text(
          null,
          geometry.x + dx,
          geometry.y + dy,
          geometry.w,
          geometry.h,
          px(size),
          value,
          BLACK
        )
        shadow.setEnable(false)
      })
      return text(null, geometry.x, geometry.y, geometry.w, geometry.h, px(size), value)
    }

    fill(null, 0, 0, width, height, BLACK)
    make(null, widget.CIRCLE, {
      center_x: centerX,
      center_y: centerY,
      radius: Math.round(radius),
      color: BORDER
    })
    make(null, widget.CIRCLE, {
      center_x: centerX,
      center_y: centerY,
      radius: Math.max(1, Math.round(radius - px(3))),
      color: BLACK
    })

    centeredText(centerX, centerY - radius * 0.73, radius * 1.05, px(29), 20, 'קידוש החודש', TITLE)
    this.sunTime = centeredText(centerX, centerY - radius * 0.55, radius * 1.25, px(34), 26, '--:----:--')

    const sideY = Math.round(centerY - radius * 0.44)
    const sideW = Math.round(radius * 0.36)
    const sideH = Math.round(radius * 0.69)
    this.leftButtonGeometry = {
      x: Math.round(centerX - radius * 0.79), y: sideY, w: sideW, h: sideH
    }
    this.rightButtonGeometry = {
      x: Math.round(centerX + radius * 0.43), y: sideY, w: sideW, h: sideH
    }
    this.leftButtonOuter = fill(null, this.leftButtonGeometry.x, sideY, sideW, sideH, BORDER, px(9))
    this.leftButtonInner = fill(
      null,
      this.leftButtonGeometry.x + px(3),
      sideY + px(3),
      sideW - px(6),
      sideH - px(6),
      BLACK,
      px(7)
    )
    this.leftButtonText = outlinedText(this.leftButtonGeometry, 19, 'מקומי')
    this.rightButtonOuter = fill(null, this.rightButtonGeometry.x, sideY, sideW, sideH, BORDER, px(9))
    this.rightButtonInner = fill(
      null,
      this.rightButtonGeometry.x + px(3),
      sideY + px(3),
      sideW - px(6),
      sideH - px(6),
      BLACK,
      px(7)
    )
    this.rightButtonText = outlinedText(this.rightButtonGeometry, 14, 'ירושלים')
    this.leftButtonText.addEventListener(event.CLICK_UP, () => this.onLocalButtonTap())
    this.rightButtonText.addEventListener(event.CLICK_UP, () => this.selectJerusalem())

    const centerInfoY = centerY - radius * 0.07
    const centerInfoGap = radius * 0.125
    this.orbitCenter = { x: centerX, y: centerInfoY }
    this.orbitRadius = Math.min(radius * 0.26, radius * 0.46 - px(13))
    make(null, widget.CIRCLE, {
      center_x: centerX,
      center_y: Math.round(centerInfoY),
      radius: Math.round(this.orbitRadius + px(1.5)),
      color: ORBIT_BORDER
    })
    make(null, widget.CIRCLE, {
      center_x: centerX,
      center_y: Math.round(centerInfoY),
      radius: Math.max(1, Math.round(this.orbitRadius)),
      color: BLACK
    })
    this.weekday = centeredText(
      centerX,
      centerInfoY - centerInfoGap,
      radius * 0.5,
      px(22),
      13,
      '--',
      LIVE_TEXT
    )
    this.date = centeredText(centerX, centerInfoY, radius * 0.72, px(25), 15, '--', LIVE_TEXT)
    this.civil = centeredText(
      centerX,
      centerInfoY + centerInfoGap,
      radius * 0.58,
      px(22),
      15,
      '--:--:--',
      LIVE_TEXT
    )

    this.sunDot = make(null, widget.CIRCLE, {
      center_x: centerX,
      center_y: Math.round(centerInfoY - this.orbitRadius),
      radius: px(6),
      color: SUN
    })
    this.moonImage = make(null, widget.IMG, {
      x: centerX - px(12),
      y: Math.round(centerInfoY - this.orbitRadius - px(12)),
      w: px(24),
      h: px(24),
      src: 'moon/moon_30_01.png',
      auto_scale: true,
      auto_scale_obj_fit: true
    })

    const centerTap = text(
      null,
      Math.round(centerX - radius * 0.24),
      sideY,
      Math.round(radius * 0.48),
      Math.round(radius * 0.71),
      1,
      '',
      BLACK
    )
    centerTap.addEventListener(event.CLICK_UP, () => this.onClockTap())

    this.moonTime = centeredText(
      centerX,
      centerY + radius * 0.36,
      radius * 1.25,
      px(34),
      25,
      '--:----:--'
    )

    const trackHalf = radius * 0.65
    this.sliderGeometry = {
      left: centerX - trackHalf,
      right: centerX + trackHalf,
      half: trackHalf,
      y: centerY + radius * 0.505
    }
    fill(
      null,
      Math.round(this.sliderGeometry.left),
      Math.round(centerY + radius * 0.48),
      Math.round(trackHalf * 2),
      Math.max(px(5), Math.round(radius * 0.05)),
      TRACK,
      px(5)
    )
    this.sliderKnob = make(null, widget.CIRCLE, {
      center_x: centerX,
      center_y: Math.round(this.sliderGeometry.y),
      radius: px(9),
      color: KNOB
    })
    const sliderTouch = text(
      null,
      0,
      Math.round(centerY + radius * 0.39),
      width,
      Math.round(radius * 0.18),
      1,
      '',
      BLACK
    )
    sliderTouch.addEventListener(event.CLICK_DOWN, info => this.updateTimeOffset(info))
    sliderTouch.addEventListener(event.MOVE, info => this.updateTimeOffset(info))
    sliderTouch.addEventListener(event.CLICK_UP, info => this.updateTimeOffset(info))

    const nowGeometry = {
      x: Math.round(centerX - radius * 0.19),
      y: Math.round(centerY + radius * 0.59),
      w: Math.round(radius * 0.38),
      h: Math.round(radius * 0.14)
    }
    fill(null, nowGeometry.x, nowGeometry.y, nowGeometry.w, nowGeometry.h, NOW_BACKGROUND, px(9))
    this.nowButton = text(
      null,
      nowGeometry.x,
      nowGeometry.y,
      nowGeometry.w,
      nowGeometry.h,
      px(15),
      'Now',
      NOW_TEXT
    )
    this.nowButton.addEventListener(event.CLICK_UP, () => this.resetToNow())

    this.status = centeredText(
      centerX,
      centerY + radius * 0.82,
      radius * 1.15,
      px(24),
      13,
      'ירושלים',
      MUTED
    )

    this.safeRefresh()
    this.timer = setInterval(() => this.safeRefresh(), 1000)
    this.refreshJerusalemContext()
    this.displayPreferenceTimer = setInterval(
      () => this.refreshJerusalemContext(),
      LOCATION_POLL_MS
    )
  },

  baseStatus() {
    if (this.locationMode !== 'local') return 'ירושלים'
    return this.localTrackingMode === 'mobile' ? 'מקומי נייד · 6 שניות' : 'מקומי קבוע'
  },

  cancelLocalTap() {
    if (this.localTapTimer) clearTimeout(this.localTapTimer)
    this.localTapTimer = null
    this.firstLocalTapAt = 0
  },

  onLocalButtonTap() {
    const now = Date.now()
    if (this.localTapTimer && now - this.firstLocalTapAt <= LOCAL_DOUBLE_TAP_MS) {
      this.cancelLocalTap()
      this.selectMobileLocalLocation()
      return
    }

    this.firstLocalTapAt = now
    this.setStatus('לחיצה נוספת: מיקום נייד', PAUSED_TEXT)
    this.localTapTimer = setTimeout(() => {
      this.localTapTimer = null
      this.firstLocalTapAt = 0
      this.selectFixedLocalLocation()
    }, LOCAL_DOUBLE_TAP_MS)
  },

  setStatus(value, color = MUTED, clearAfter = 0) {
    if (!this.status) return
    const w = Math.round(this.radius * 1.15)
    const h = this.px(24)
    this.status.setProperty(prop.MORE, {
      x: Math.round(this.centerX - w / 2),
      y: Math.round(this.centerY + this.radius * 0.82 - h / 2),
      w,
      h,
      text: value,
      text_size: this.px(13),
      color,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
    if (this.statusTimer) clearTimeout(this.statusTimer)
    this.statusTimer = null
    if (clearAfter) {
      this.statusTimer = setTimeout(() => {
        this.statusTimer = null
        this.setStatus(this.baseStatus())
      }, clearAfter)
    }
  },

  onClockTap() {
    if (!this.pausedEpoch) {
      this.pausedEpoch = Date.now()
      this.setStatus('חישוב המולד נעצר', PAUSED_TEXT)
      this.safeRefresh()
      return
    }

    const selectedEpoch = this.pausedEpoch + this.offsetSeconds * 1000
    this.pausedEpoch = 0
    this.sendStoppedTime(selectedEpoch)
    this.safeRefresh()
  },

  updateTimeOffset(info) {
    const rawX = Number(info && info.x)
    if (!Number.isFinite(rawX)) return
    const x = clamp(rawX, this.sliderGeometry.left, this.sliderGeometry.right)
    const normalized = (x - this.centerX) / this.sliderGeometry.half
    this.offsetSeconds = -Math.round((normalized * 10800) / 300) * 300
    this.safeRefresh()
  },

  resetToNow() {
    this.offsetSeconds = 0
    this.safeRefresh()
  },

  calculationContext(epoch) {
    return {
      parts: zonedParts(epoch, this.utcOffsetMinutes),
      offsetMinutes: this.utcOffsetMinutes
    }
  },

  sendStoppedTime(epoch) {
    const context = this.calculationContext(epoch)
    const selected = jclockSnapshot(
      context.parts,
      this.latitude,
      this.longitude,
      context.offsetMinutes / 60
    )
    this.setStatus('שולח לטלפון…', PAUSED_TEXT)
    sendSnapshot({
      epoch,
      timeZone: this.timeZone,
      sun: { title: SUN_TITLE, time: selected.sun.value },
      moon: { title: MOON_TITLE, time: selected.moon ? selected.moon.value : '--:----:--' }
    }, ({ state }) => {
      if (state === 'sent') this.setStatus('נשלח לטלפון', PAUSED_TEXT, 2600)
      else if (state === 'queued') this.setStatus('ממתין לטלפון', PAUSED_TEXT, 3200)
      else if (state === 'error') this.setStatus('אין חיבור לטלפון', ERROR, 3200)
    }).catch(() => {})
  },

  refreshJerusalemContext() {
    requestPhoneLocation('jerusalem')
      .then((value) => {
        const location = normalizedLocation(value)
        if (!location) return
        this.applyDisplayPreference(location.keepScreenOn)
        this.jerusalemUtcOffsetMinutes = location.utcOffsetMinutes
        if (this.locationMode === 'jerusalem') {
          this.utcOffsetMinutes = location.utcOffsetMinutes
          this.timeZone = location.timeZone || 'Asia/Jerusalem'
        }
        this.safeRefresh()
      })
      .catch(() => {})
  },

  selectJerusalem() {
    this.cancelLocalTap()
    this.locationGeneration += 1
    this.desiredLocationMode = 'jerusalem'
    this.locationMode = 'jerusalem'
    this.localTrackingMode = 'jerusalem'
    this.latitude = LATITUDE
    this.longitude = LONGITUDE
    this.utcOffsetMinutes = this.jerusalemUtcOffsetMinutes
    this.timeZone = 'Asia/Jerusalem'
    this.mobileLocationEnabled = false
    this.locationRequestInFlight = false
    this.stopLocationPolling()
    this.safeRefresh()
    this.setStatus('ירושלים')
    this.refreshJerusalemContext()
  },

  selectFixedLocalLocation() {
    const generation = ++this.locationGeneration
    this.desiredLocationMode = 'local'
    this.localTrackingMode = 'fixed'
    this.locationRequestInFlight = true
    this.stopLocationPolling()
    this.setStatus('מחפש מיקום קבוע…', PAUSED_TEXT)
    requestPhoneLocation('fixed')
      .then((value) => {
        this.locationRequestInFlight = false
        if (generation !== this.locationGeneration || this.desiredLocationMode !== 'local') return
        const location = normalizedLocation(value)
        if (!location) throw new Error('invalid phone location')
        this.applyLocalLocation(location, 'fixed')
        this.setStatus(this.baseStatus())
      })
      .catch(() => {
        this.locationRequestInFlight = false
        if (generation !== this.locationGeneration || this.desiredLocationMode !== 'local') return
        this.desiredLocationMode = this.locationMode
        this.setStatus('המיקום לא זמין', ERROR, 3200)
      })
  },

  selectMobileLocalLocation() {
    const generation = ++this.locationGeneration
    this.desiredLocationMode = 'local'
    this.localTrackingMode = 'mobile'
    this.locationRequestInFlight = true
    this.stopLocationPolling()
    this.setStatus('מבקש GPS נייד…', PAUSED_TEXT)
    requestPhoneLocation('mobile')
      .then((value) => {
        this.locationRequestInFlight = false
        if (generation !== this.locationGeneration || this.localTrackingMode !== 'mobile') return
        const location = normalizedLocation(value)
        if (!location) throw new Error('invalid phone location')
        this.applyLocalLocation(location, 'mobile')
        this.startLocationPolling()
        this.setStatus(this.baseStatus())
      })
      .catch(() => {
        this.locationRequestInFlight = false
        if (generation !== this.locationGeneration || this.localTrackingMode !== 'mobile') return
        this.desiredLocationMode = this.locationMode
        this.setStatus('GPS נייד אינו זמין', ERROR, 3200)
      })
  },

  applyLocalLocation(location, trackingMode = this.localTrackingMode) {
    this.locationMode = 'local'
    this.desiredLocationMode = 'local'
    this.localTrackingMode = trackingMode
    this.latitude = location.latitude
    this.longitude = location.longitude
    this.utcOffsetMinutes = location.utcOffsetMinutes
    this.timeZone = location.timeZone || this.timeZone
    this.mobileLocationEnabled = trackingMode === 'mobile'
    this.applyDisplayPreference(location.keepScreenOn)
    this.safeRefresh()
  },

  startLocationPolling() {
    this.stopLocationPolling()
    this.locationPollTimer = setInterval(() => this.pollMobileLocation(), LOCATION_POLL_MS)
  },

  stopLocationPolling() {
    if (this.locationPollTimer) clearInterval(this.locationPollTimer)
    this.locationPollTimer = null
  },

  pollMobileLocation() {
    if (
      this.locationMode !== 'local' ||
      this.localTrackingMode !== 'mobile' ||
      this.locationRequestInFlight
    ) return
    const generation = this.locationGeneration
    this.locationRequestInFlight = true
    requestPhoneLocation('mobile')
      .then((value) => {
        this.locationRequestInFlight = false
        if (
          generation !== this.locationGeneration ||
          this.locationMode !== 'local' ||
          this.localTrackingMode !== 'mobile'
        ) return
        if (value && value.updated !== false) {
          const location = normalizedLocation(value)
          if (location) this.applyLocalLocation(location, 'mobile')
        }
      })
      .catch(() => {
        this.locationRequestInFlight = false
      })
  },

  applyMoladButton(outer, inner, label, geometry, colors) {
    const foreground = colorNumber(colors && colors.foreground, BORDER)
    const background = colorNumber(colors && colors.background, BLACK)
    outer.setProperty(prop.MORE, {
      x: geometry.x,
      y: geometry.y,
      w: geometry.w,
      h: geometry.h,
      color: foreground,
      radius: this.px(9)
    })
    inner.setProperty(prop.MORE, {
      x: geometry.x + this.px(3),
      y: geometry.y + this.px(3),
      w: geometry.w - this.px(6),
      h: geometry.h - this.px(6),
      color: background,
      radius: this.px(7)
    })
    label.setProperty(prop.MORE, {
      x: geometry.x,
      y: geometry.y,
      w: geometry.w,
      h: geometry.h,
      color: foreground,
      text_size: geometry === this.leftButtonGeometry ? this.px(19) : this.px(14),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V
    })
  },

  applyDisplayPreference(keepScreenOn) {
    if (keepScreenOn) setPageBrightTime({ brightTime: 2147483000 })
    else resetPageBrightTime()
  },

  safeRefresh() {
    try {
      this.refresh()
      return true
    } catch (error) {
      this.setStatus('שגיאת תצוגה · פתח מחדש', ERROR)
      return false
    }
  },

  refresh() {
    if (!this.sunTime) return
    const epoch = (this.pausedEpoch || Date.now()) + this.offsetSeconds * 1000
    const context = this.calculationContext(epoch)
    const snapshot = jclockSnapshot(
      context.parts,
      this.latitude,
      this.longitude,
      context.offsetMinutes / 60
    )
    const jerusalemContext = {
      parts: zonedParts(epoch, this.jerusalemUtcOffsetMinutes),
      offsetMinutes: this.jerusalemUtcOffsetMinutes
    }
    const jerusalemSnapshot = jclockSnapshot(
      jerusalemContext.parts,
      LATITUDE,
      LONGITUDE,
      jerusalemContext.offsetMinutes / 60
    )
    this.snapshot = snapshot

    this.sunTime.setProperty(prop.TEXT, snapshot.sun.value)
    this.moonTime.setProperty(prop.TEXT, snapshot.moon ? snapshot.moon.value : '--:----:--')
    const centerColor = this.pausedEpoch ? PAUSED_TEXT : LIVE_TEXT
    this.date.setProperty(prop.MORE, {
      text: snapshot.hebrew.formatted,
      color: centerColor
    })
    this.weekday.setProperty(prop.MORE, {
      text: `יום ${WEEKDAYS[snapshot.hebrew.weekday] || ''}`,
      color: centerColor
    })
    this.civil.setProperty(prop.MORE, {
      text: civilTimeFromParts(context.parts),
      color: centerColor
    })

    const sun = sourcePosition(snapshot.sun, this.orbitCenter, this.orbitRadius)
    const moon = sourcePosition(snapshot.moon, this.orbitCenter, this.orbitRadius)
    this.sunDot.setProperty(prop.MORE, {
      center_x: sun.x,
      center_y: sun.y,
      radius: this.px(6),
      color: SUN
    })
    this.moonImage.setProperty(prop.MORE, {
      x: moon.x - this.px(12),
      y: moon.y - this.px(12),
      w: this.px(24),
      h: this.px(24),
      src: moonAsset(snapshot),
      auto_scale: true,
      auto_scale_obj_fit: true
    })
    this.sliderKnob.setProperty(prop.MORE, {
      center_x: Math.round(
        this.centerX - this.sliderGeometry.half * (this.offsetSeconds / 10800)
      ),
      center_y: Math.round(this.sliderGeometry.y),
      radius: this.px(9),
      color: KNOB
    })

    this.applyMoladButton(
      this.leftButtonOuter,
      this.leftButtonInner,
      this.leftButtonText,
      this.leftButtonGeometry,
      jerusalemSnapshot.molad.sun
    )
    this.applyMoladButton(
      this.rightButtonOuter,
      this.rightButtonInner,
      this.rightButtonText,
      this.rightButtonGeometry,
      jerusalemSnapshot.molad.moon
    )
  },

  onDestroy() {
    if (this.timer) clearInterval(this.timer)
    if (this.statusTimer) clearTimeout(this.statusTimer)
    if (this.localTapTimer) clearTimeout(this.localTapTimer)
    if (this.displayPreferenceTimer) clearInterval(this.displayPreferenceTimer)
    resetPageBrightTime()
    this.stopLocationPolling()
  }
})
