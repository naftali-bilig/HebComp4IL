# JClock / HebrewClock / שעון ירושלים

JClock הוא אתר ואפליקציית זמן עברי המבוססים על הרעיון של HebrewClock ועל
שיטת "שעון ירושלים": חישוב זמן עברי-סולארי וזמן עברי-לונארי ביחס לירושלים,
למיקום המשתמש ולשעה המקומית הרגילה.

## הצהרת המחבר

הקוד המקורי של HebrewClock נכתב בשנת התש"ע, במהלך חול המועד סוכות, ופורסם
לאחר מכן כאפליקציה בשם HebrewClock.

לאחר הפרסום פנה אליי גורם חיצוני וביקש את עזרתי. לפי מיטב זיכרוני
והבנתי, באותה עת לא נאמר לי שקיים פטנט, או הליך רישום פטנט, הקשור לנושא.
אני הבנתי את הדברים כבקשת עזרה טכנית, ולא כקשר לפטנט או להעברת זכויות
כלשהי. בדיעבד, לתחושתי האישית, נוצר מצב שבו תרומתי והבסיס שפיתחתי נוצלו
באופן שפגע בי, בין היתר כנגד תמורה כספית זניחה של עד 1000 ש"ח.

לבסוף קראתי לשיטה וליישום בשם "שעון ירושלים": על שם הזמן העברי שחזר
והתמקם בעיר ירושלים, כאשר נקודת הייחוס והמשמעות של הזמן נגזרת מאותו הבית,
הר הבית, ובניגוד לשיטת הזמן המוסלמית המקובלת כיום ברחבי העולם.

## הבהרה טכנית

שיטת החישוב של שעון ירושלים רחוקה במהותה מהגדרה של טיימר.

טיימר הוא הליך רציף המוגדר על ידי מרחק בזמן. לעומת זאת, שעון ירושלים מחשב
בכל שנייה מחדש את ההמרה משעה רגילה לשעה סולארית ולונארית. הדבר יוצר תחושה
של שעון רציף, אך בפועל מדובר בנוסחה לינארית שמשתנה בתחילת כל יום ולילה לפי
חישוב קבוע, המבוסס על המיקום בירושלים ועל השעה המקומית הרגילה של המשתמש.
בפועל מדובר בסדרה של חישובים המתעדכנת בכל שנייה מחדש לפי משתנה המייצג את
כמות השניות שחלפו מאז הזריחה, ביחס לאורך היום כולו בשניות. באופן דומה,
בחישובי הלילה נעשה שימוש ביחס שבין השניות שחלפו מתחילת הלילה לבין אורך
הלילה כולו בשניות.

## הבהרת אי-קשר לפטנט

אני מסיר אחריות מכל קשר לפטנט שנכתב או נרשם, ככל שנכתב או נרשם, בקשר
לנושא זה. פרויקט זה אינו טוען לממש פטנט, להסתמך על פטנט, לקבל רישיון
מפטנט, או להיגזר מפטנט כלשהו.

למיטב הבנתי, כל קשר שנוצר בין הפיתוח שלי לבין מסמך פטנט כלשהו אינו קשר
שנוצר ביוזמתי או בהסכמתי המודעת. אני רואה בפיתוח הזה יצירה עצמאית שלי,
שנולדה מתוך צורך אישי וחברתי עמוק, ולא לכבודו או לשמו של אדם אחר.

השעון פותח כדי לענות על קושי אישי וחברתי שלי סביב זמן, אכילה ומשמעות.
מניעת הפרסום והבלבול סביב הקשר הנטען לפטנט גרמו לי, להבנתי ולתחושתי,
נזק ממשי בהכרה החברתית בי, ברגישות שלי לזמן, וביכולת להציג את הרעיונות
שעל בסיסם פיתחתי את הפרויקט ואת האתר הרחב יותר.

בכבוד רב,  
נפתלי, השקוף, אבל עדיין בן-אדם בכל זאת.

## Use Cases

1. HebrewCommercial13 X 2:
   - https://JClock.net/HebrewCommercial13/public/family
2. HebrewClock13 X 2 only:
   - https://JClock.net/HebrewClock13/public/family
3. HebrewCommercial13 X HebrewClock13 X 2:
   - https://JClock.net

## Project Components

- `public/HebrewClock13` - the HebrewClock application.
- `public/HebrewCommercial13` - commercial and presentation flows.
- `public/HebrewSchedule13` - schedule-oriented access to JClock views.
- `public/BirthCalculator` - date, time, and location based entry flow.

## Calculation Base

Parts of the project use modified and improved solar and lunar calculation
logic based on the original SunCalc library by Vladimir Agafonkin, licensed
under the BSD-2-Clause License. All modifications and improvements in this
repository were made by Naftali Bilig.

## Platform

- Static web application
- Firebase Hosting
- HTML, CSS, and JavaScript
- Supported languages include Hebrew and English

## License

See [LICENSE](LICENSE) for the repository license.
