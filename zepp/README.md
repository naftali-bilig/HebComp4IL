# JClock for Zepp OS

This is the Zepp OS port of the Wear OS JClock app. It is a native Zepp Mini
Program: no WebView or external server is required. The calculations themselves
run locally on the watch. Jerusalem mode uses `Asia/Jerusalem`; Local mode uses
the device's local clock and coordinates received from the Android companion.

The watch screen mirrors the Galaxy Watch release: the same circular layout,
Jerusalem/Local controls, stopped-clock action, three-hour time slider, Now
button, solar/lunar orbit, and Jerusalem-anchored molad colors are preserved.

The location modes are deliberately distinct:

- One press on Local stores one fixed high-accuracy phone GPS position.
- Two presses on Local within 650 ms enable mobile mode and request a fresh
  high-accuracy phone GPS position every 6000 ms.
- Jerusalem stops local refreshes and restores the fixed Jerusalem coordinates.

## Build

1. Install Node.js and run `npm install` in this directory.
2. Run `npm run build` to create the `.zab` installer.
3. Run `npm run preview`, then scan the QR code from the Zepp app developer
   preview screen.

Configured targets: Amazfit Cheetah Round (454x454), Cheetah Square (390x450),
and Cheetah Pro (480x480), including the documented regional device sources.
