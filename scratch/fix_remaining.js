const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'ro', 'en', 'de', 'fr', 'it', 'es', 'pt', 'hu', 'bg', 'pl', 
  'cs', 'sk', 'hr', 'sr', 'sl', 'nl', 'el', 'tr', 'uk', 'ru', 
  'sv', 'da', 'ar'
];

const NEW_ROMANIAN_UI_STRINGS = {
  "request_btn_submit_price": "Cere AERO ({price} {currency})",
  "active_sos_alert_error": "Eroare la alertare.",
  "rating_submit_btn": "Trimite Evaluarea",
  "rating_skip_btn": "Omite pentru moment",
  "profile_section_app_settings": "Setări Aplicație",
  "profile_history_rides": "Istoric curse",
  "profile_saved_addresses": "Adrese salvate",
  "profile_section_admin": "Admin",
  "profile_admin_panel": "Admin Panel",
  "profile_btn_delete_account": "Șterge Contul",
  "profile_support_title": "Suport",
  "profile_support_message": "Contactează support@aero-app.com",
  "rides_history_title": "Istoricul curselor",
  "rides_empty_subtitle_passenger": "Cursele tale vor apărea aici",
  "sub_benefit_3_driver": "Suport prioritar In-App 24/7",
  "sub_payment_confirmed_title": "Plată Confirmată",
  "sub_btn_radar": "Mergi la Radar",
};

const replacements = {
  "components/feature/DriverRequestCard.tsx": [
    { search: "export function DriverRequestCard({ request, onAccept, onIgnore }: DriverRequestCardProps) {", replace: "export function DriverRequestCard({ request, onAccept, onIgnore }: DriverRequestCardProps) {\n  const { t } = useI18n();" },
    { search: "<Text style={styles.ignoreText}>Ignoră</Text>", replace: "<Text style={styles.ignoreText}>{t('driver_card_btn_ignore')}</Text>" },
    { search: "<Text style={styles.acceptText}>Acceptă</Text>", replace: "<Text style={styles.acceptText}>{t('driver_card_btn_accept')}</Text>" }
  ],
  "app/(passenger)/request.tsx": [
    { search: "label={`Cere AERO (${finalOffer} ${CURRENCY})`}", replace: "label={t('request_btn_submit_price', { price: finalOffer, currency: CURRENCY })}" }
  ],
  "app/(passenger)/active.tsx": [
    { search: "driverPos < 0.1 ? 'Șoferul este pe drum' : driverPos < 0.9 ? 'Cursa este în desfășurare' : 'Aproape ați ajuns'", replace: "driverPos < 0.1 ? t('active_status_ontheway') : driverPos < 0.9 ? t('active_status_inprogress') : t('active_status_arrived')" },
    { search: "<Text style={styles.sosText}>SOS</Text>", replace: "<Text style={styles.sosText}>{t('active_sos_btn')}</Text>" },
    { search: "showAlert('SOS Activ', 'Echipa AERO a fost alertată și monitorizează cursa!', [{ text: 'Închide' }]);", replace: "showAlert(t('active_sos_alerted_title'), t('active_sos_alerted'), [{ text: t('active_close_btn') }]);" },
    { search: "showAlert('Eroare', 'Eroare la alertare.');", replace: "showAlert(t('common_error'), t('active_sos_alert_error'));" }
  ],
  "app/(passenger)/rating.tsx": [
    { search: 'label="Trimite Evaluarea"', replace: 'label={t(\'rating_submit_btn\')}' },
    { search: '<Text style={styles.skipText}>Omite pentru moment</Text>', replace: '<Text style={styles.skipText}>{t(\'rating_skip_btn\')}</Text>' }
  ],
  "app/(passenger)/profile.tsx": [
    { search: "<Text style={styles.sectionTitle}>Setări Aplicație</Text>", replace: "<Text style={styles.sectionTitle}>{t('profile_section_app_settings')}</Text>" },
    { search: "<Text style={styles.rowText}>Istoric curse</Text>", replace: "<Text style={styles.rowText}>{t('profile_history_rides')}</Text>" },
    { search: "<Text style={styles.rowText}>Adrese salvate</Text>", replace: "<Text style={styles.rowText}>{t('profile_saved_addresses')}</Text>" },
    { search: "<Text style={[styles.rowText, { color: colors.danger }]}>Deconectare</Text>", replace: "<Text style={[styles.rowText, { color: colors.danger }]}>{t('profile_logout_title')}</Text>" },
    { search: "<Text style={styles.sectionTitle}>Admin</Text>", replace: "<Text style={styles.sectionTitle}>{t('profile_section_admin')}</Text>" },
    { search: "<Text style={styles.rowText}>Admin Panel</Text>", replace: "<Text style={styles.rowText}>{t('profile_admin_panel')}</Text>" },
    { search: 'label="Șterge Contul"', replace: 'label={t(\'profile_btn_delete_account\')}' },
    { search: "showAlert('Suport', 'Contactează support@aero-app.com')", replace: "showAlert(t('profile_support_title'), t('profile_support_message'))" }
  ],
  "app/(driver)/profile.tsx": [
    { search: "<Text style={[styles.rowText, { color: colors.danger }]}>Deconectare</Text>", replace: "<Text style={[styles.rowText, { color: colors.danger }]}>{t('profile_logout_title')}</Text>" }
  ],
  "app/(passenger)/rides.tsx": [
    { search: '<Header title="Istoricul curselor" />', replace: '<Header title={t(\'rides_history_title\')} />' },
    { search: '<Text style={styles.emptyText}>Cursele tale vor apărea aici</Text>', replace: '<Text style={styles.emptyText}>{t(\'rides_empty_subtitle_passenger\')}</Text>' }
  ],
  "app/(driver)/drive.tsx": [
    { search: "showAlert('Apel', 'Apelare 0722000000...')", replace: "showAlert(t('active_call_btn'), t('active_call_dialing'))" },
    { search: "showAlert('Cursă finalizată', `Ai încasat ${r.finalPrice} ${CURRENCY}. Bani adăugați în contul tău Stripe.`);", replace: "showAlert(t('driver_ride_complete_alert_title'), t('driver_ride_complete_alert_msg', { price: r.finalPrice, currency: CURRENCY }));" }
  ],
  "app/(driver)/subscription.tsx": [
    { search: '<Benefit text="Comision 0% la toate cursele" icon="money-off" />', replace: '<Benefit text={t(\'sub_benefit_1\')} icon="money-off" />' },
    { search: '<Benefit text="Acces la toate tipurile de cereri (AERO, VIP)" icon="verified" />', replace: '<Benefit text={t(\'sub_benefit_2\')} icon="verified" />' },
    { search: '<Benefit text="Suport prioritar In-App 24/7" icon="support-agent" />', replace: '<Benefit text={t(\'sub_benefit_3_driver\')} icon="support-agent" />' },
    { search: "label={isProcessing ? 'Se procesează plata...' : 'Plătește sigur prin Stripe'}", replace: "label={isProcessing ? t('sub_processing') : t('sub_btn_pay')}" },
    { search: "showAlert('Plată Confirmată', 'Abonamentul AERO Flex a fost activat! Poți prelua curse din nou.', [", replace: "showAlert(t('sub_payment_confirmed_title'), t('sub_success_message'), [" },
    { search: "text: 'Mergi la Radar',", replace: "text: t('sub_btn_radar')," }
  ],
  "app/(admin)/drivers.tsx": [
    { search: "showAlert('Aprobat ✅', 'Șoferul a fost aprobat și are 3 luni trial.');", replace: "showAlert(t('admin_drivers_approved_alert_title'), t('admin_drivers_approved_alert'));" },
    { search: "showAlert('Respins', 'Șoferul a fost respins.');", replace: "showAlert(t('admin_drivers_rejected_alert_title'), t('admin_drivers_rejected_alert'));" }
  ],
  "app/(admin)/settings.tsx": [
    { search: '<Text style={styles.dangerBtnText}>Deconectare Admin</Text>', replace: '<Text style={styles.dangerBtnText}>{t(\'admin_settings_btn_logout\')}</Text>' }
  ]
};

async function translateStrings(texts, targetLang) {
  if (targetLang === 'ro') {
    return [...texts];
  }
  
  const combinedText = texts.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ro&tl=${targetLang}&dt=t&q=${encodeURIComponent(combinedText)}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      const translated = data[0].map(item => {
        let val = item[0];
        if (val.endsWith('\n')) val = val.slice(0, -1);
        return val.trim();
      });
      if (translated.length === texts.length) {
        return translated;
      } else {
        const joined = data[0].map(item => item[0]).join('');
        const splitLines = joined.split('\n').map(s => s.trim());
        if (splitLines.length === texts.length) {
          return splitLines;
        }
      }
    }
  } catch (err) {
    console.error(`Failed to translate to ${targetLang}:`, err.message);
  }
  
  return [...texts];
}

async function run() {
  console.log("Loading existing locales.ts...");
  const localesPath = path.join("c:", "Users", "LucianCebuc", "AERO", "constants", "locales.ts");
  const localesContent = fs.readFileSync(localesPath, 'utf8');
  
  // Extract JSON structure from locales.ts
  const jsonStr = localesContent.substring(localesContent.indexOf('{'), localesContent.lastIndexOf('}') + 1);
  const allTranslations = JSON.parse(jsonStr);
  
  console.log("Translating new keys for all 23 languages...");
  const keys = Object.keys(NEW_ROMANIAN_UI_STRINGS);
  const romanianTexts = Object.values(NEW_ROMANIAN_UI_STRINGS);
  
  for (const lang of LANGUAGES) {
    console.log(`Translating new keys to [${lang}]...`);
    const translatedTexts = await translateStrings(romanianTexts, lang);
    
    // Merge into translations
    if (!allTranslations[lang]) allTranslations[lang] = {};
    for (let i = 0; i < keys.length; i++) {
      allTranslations[lang][keys[i]] = translatedTexts[i];
    }
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log("Saving updated translations to locales.ts...");
  let newLocalesContent = `export const translations = ${JSON.stringify(allTranslations, null, 2)};\n\n`;
  newLocalesContent += `export type Language = keyof typeof translations;\n`;
  newLocalesContent += `export type TranslationKey = keyof typeof translations.en;\n`;
  
  fs.writeFileSync(localesPath, newLocalesContent, 'utf8');
  console.log("locales.ts updated successfully!");
  
  console.log("Applying remaining string replacements...");
  for (const [relPath, fileReps] of Object.entries(replacements)) {
    const filePath = path.join("c:", "Users", "LucianCebuc", "AERO", relPath.replace(/\//g, path.sep));
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let count = 0;
    for (const rep of fileReps) {
      if (content.includes(rep.search)) {
        content = content.split(rep.search).join(rep.replace);
        count++;
      } else {
        console.warn(`Replacement target not found in ${relPath}: "${rep.search}"`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${relPath} with ${count} replacements.`);
  }
  
  console.log("All fixes applied successfully!");
}

run().catch(console.error);
