const fs = require('fs');
const path = require('path');

const LANGUAGES = [
  'ro', 'en', 'de', 'fr', 'it', 'es', 'pt', 'hu', 'bg', 'pl', 
  'cs', 'sk', 'hr', 'sr', 'sl', 'nl', 'el', 'tr', 'uk', 'ru', 
  'sv', 'da', 'ar'
];

const ROMANIAN_UI_STRINGS = {
  // Landing (existing)
  "landing_tagline": "Abonamente · Prețuri corecte",
  "landing_headline_1": "Negociază prețul cursei.",
  "landing_headline_2": "Abonează-te și\ncălătorește.",
  "landing_subtext": "Un marketplace șofer–pasager unde tu propui\nprețul și alegi planul care ți se potrivește.",
  "landing_passenger_btn": "Sunt pasager",
  "landing_driver_btn": "Sunt șofer",
  "landing_login_q": "Ai deja cont? ",
  "landing_login_link": "Conectează-te",

  // Auth: Login
  "login_welcome_back": "Bun venit înapoi",
  "login_subtitle": "Conectează-te la contul tău",
  "login_btn_submit": "Conectează-te",
  "login_no_account": "Nu ai cont?",
  "login_no_account_spaced": "Nu ai cont? ",
  "login_link_register": "Înregistrează-te",
  "login_label_email": "Email",
  "login_label_password": "Parolă",
  "login_placeholder_password": "Minim 6 caractere",
  "login_error_empty_fields": "Completează toate câmpurile.",
  "login_error_auth_failed": "Autentificare eșuată. Verifică datele și încearcă din nou.",

  // Auth: Register
  "register_btn_submit": "Creează cont",
  "register_subtitle": "Gratuit. Fără comision.",
  "register_have_account": "Ai deja cont?",
  "register_have_account_spaced": "Ai deja cont? ",
  "register_link_login": "Conectează-te",
  "register_label_name": "Nume complet",
  "register_placeholder_name": "Ion Popescu",
  "register_label_email": "Email",
  "register_placeholder_email": "adresa@email.com",
  "register_label_phone": "Număr de telefon",
  "register_placeholder_phone": "+40 7xx xxx xxx",
  "register_label_password": "Parolă",
  "register_placeholder_password": "Minim 6 caractere",
  "register_section_vehicle": "Detalii vehicul",
  "register_label_car_make": "Marcă",
  "register_placeholder_car_make": "ex: Toyota",
  "register_label_car_model": "Model",
  "register_placeholder_car_model": "ex: Camry",
  "register_label_car_plate": "Număr înmatriculare",
  "register_placeholder_car_plate": "ex: B 123 ABC",
  "register_driver_note": "Vei putea adăuga poza vehiculului și documentele la pasul următor. Contul va fi activat după verificarea manuală a documentelor.",
  "register_error_empty_fields": "Completează toate câmpurile obligatorii.",
  "register_error_password_length": "Parola trebuie să aibă minim 6 caractere.",
  "register_error_vehicle_data": "Completează datele vehiculului.",
  "register_error_failed": "Înregistrare eșuată. Încearcă din nou.",
  "role_driver": "Șofer",
  "role_passenger": "Pasager",

  // Language selection
  "lang_title": "Alege limba",
  "lang_subtitle": "Select language / Choisissez la langue",
  "lang_btn_continue": "Continuă",

  // Common/General
  "common_error": "Eroare",
  "common_back": "Înapoi",

  // Passenger layouts/tabs
  "tab_passenger_ride": "Cursă",
  "tab_passenger_history": "Istoricul meu",
  "tab_passenger_passes": "Locații",
  "tab_passenger_profile": "Profil",

  // Driver layouts/tabs
  "tab_driver_drive": "Drive/Radar",
  "tab_driver_subscription": "Abonament",
  "tab_driver_rides": "Rides",
  "tab_driver_profile": "Profil",
  
  // Admin layout/tabs
  "tab_admin_drivers": "Șoferi",

  // Ride screen
  "ride_search_placeholder": "Unde mergi?",
  "ride_greeting_subtitle": "Unde te ducem azi?",
  "ride_active_banner_title": "Cursă în desfășurare",
  "ride_greeting_prefix": "Salut, ",
  "ride_greeting_fallback": "pasager",

  // Request ride screen
  "request_error_no_destination": "Alege o destinație mai întâi.",
  "request_class_title": "Alege clasa",
  "request_class_aero_name": "AERO",
  "request_class_aero_desc": "Curse rapide și accesibile",
  "request_class_plus_name": "AERO+",
  "request_class_plus_desc": "Mașini mai spațioase",
  "request_class_vip_name": "VIP",
  "request_class_vip_desc": "Premium & Business",
  "request_price_title": "Oferă un preț",
  "request_price_sub": "Sugerăm {basePrice} {currency}. Crește oferta pentru a găsi șofer mai repede.",
  "request_btn_submit": "Trimite solicitarea",
  "request_btn_submitting": "Se trimite...",

  // Searching screen
  "searching_text": "Căutăm șoferi în apropiere...",
  "searching_accept_offer_btn": "Acceptă oferta",
  "searching_offers_title": "Oferte primite ({count})",
  "searching_cancel_btn": "Anulează",

  // Active ride screen
  "active_status_ontheway": "Șoferul este pe drum",
  "active_status_waiting": "Așteptare pasager",
  "active_status_inprogress": "Cursa este în desfășurare",
  "active_status_arrived": "Aproape ați ajuns",
  "active_chat_btn": "Chat",
  "active_sos_btn": "SOS",
  "active_sos_alerted_title": "SOS Activ",
  "active_sos_alerted": "Echipa AERO a fost alertată și monitorizează cursa!",
  "active_share_btn": "Share",
  "active_complete_btn": "Finalizează",
  "active_close_btn": "Închide",
  "active_waze_btn": "Waze",
  "active_maps_btn": "Google Maps",
  "active_call_btn": "Apelează",
  "active_call_dialing": "Apelare 0722000000...",

  // Rating screen
  "rating_headline": "Ai ajuns la destinație!",
  "rating_skip_btn": "Omite pentru moment",
  "rating_comment_placeholder": "Adaugă un comentariu (opțional)...",
  "rating_submit_btn": "Trimite review",
  "rating_subtext": "Cum a fost cursa cu {driverName}?",

  // Profile screen
  "profile_section_account": "Contul Meu",
  "profile_no_phone": "Fără număr",
  "profile_subscription_title": "Abonament AERO",
  "profile_trial_active": "Trial activ ({days} zile)",
  "profile_status_pending": "În Așteptare",
  "profile_my_car": "Mașina Mea",
  "profile_section_driver_settings": "Setări Șofer",
  "profile_section_prefs": "Preferințe Aplicație",
  "profile_language": "Limbă / Language",
  "profile_dark_mode": "Dark Mode",
  "profile_dark_mode_note": "Tema va fi aplicată după repornirea aplicației (Mock).",
  "profile_support_help": "Suport & Ajutor",
  "profile_logout_title": "Deconectare",
  "profile_logout_confirm": "Deconectează-mă",
  "profile_logout_message": "Ești sigur?",
  "profile_logout_cancel": "Anulează",

  // Rides screen
  "rides_total_rides": "Curse totale",
  "rides_total_earnings": "Câștiguri totale",
  "rides_average_rating": "Rating mediu",
  "rides_empty_title": "Nicio cursă încă",
  "rides_empty_subtitle": "Cursele tale vor apărea după finalizare",

  // Drive/Onboarding/RADAR screen
  "driver_onboarding_title": "Devino Șofer AERO",
  "driver_onboarding_lead": "Primești comenzi de la pasageri pe bază de abonament. Comisionul AERO este 0% — banii merg direct la tine.",
  "driver_benefit_payments": "Plăți directe în contul tău (Stripe Connect)",
  "driver_benefit_trial": "1 lună gratuită la aprobare",
  "driver_benefit_negotiation": "Tu controlezi prețul prin contraoferte",
  "driver_benefit_destination": "Destinația vizibilă înainte de acceptare",
  "driver_onboarding_btn": "Începe înregistrarea",
  "driver_pending_title": "Documente în verificare",
  "driver_pending_text": "Echipa AERO îți verifică actele. Vei putea prelua curse imediat după aprobare.",
  "driver_pending_btn_simulate": "Simulează aprobarea",
  "driver_expired_title": "Abonament expirat",
  "driver_expired_text": "Reînnoiește abonamentul pentru a relua cursele.",
  "driver_expired_btn_choose": "Alege Abonament (50 RON/lună)",
  "driver_expired_btn_mock": "Activează Mock",
  "driver_radar_online": "Online · primești comenzi",
  "driver_radar_offline": "Offline",
  "driver_radar_btn_online": "Intră Online",
  "driver_radar_btn_offline": "Ieși Offline",
  "driver_radar_requests_title": "Cereri în apropiere",
  "driver_radar_no_requests": "Nu sunt cereri momentan. Stai online.",
  "driver_ride_btn_arrived": "Am ajuns la Preluare",
  "driver_ride_btn_start": "Începe Cursa",
  "driver_ride_btn_complete": "Finalizează cursa",
  "driver_ride_btn_nav_pickup": "Navighează (Waze / Maps)",
  "driver_ride_btn_nav_dropoff": "Navighează spre Destinație",
  "driver_ride_complete_alert_title": "Cursă finalizată",
  "driver_ride_complete_alert_msg": "Pasagerul a plătit {price} {currency}. Mulțumim!",

  // Subscription screen
  "sub_title": "Abonament AERO",
  "sub_hero_desc": "Păstrezi 100% din banii pe cursă, cu 0 comision.",
  "sub_benefits_title": "Ce include abonamentul?",
  "sub_benefit_1": "Comision 0% — păstrezi 100% din cursă",
  "sub_benefit_2": "Acces complet la toate cursele",
  "sub_benefit_3": "Chat + navigație integrată",
  "sub_benefit_4": "Plăți zilnice direct în contul tău",
  "sub_btn_pay": "Plătește sigur prin Stripe",
  "sub_footer_text": "Plata este securizată de Stripe. Abonamentul se va reînnoi automat în fiecare lună. Poți anula oricând din setări.",
  "sub_processing": "Se procesează plata...",
  "sub_success_message": "Abonamentul AERO Flex a fost activat! Poți prelua curse din nou.",

  // Admin section
  "admin_alerts_title": "Alerte & Rapoarte",
  "admin_alerts_subtitle": "Live monitoring · Realtime",
  "admin_alerts_empty": "Nicio alertă activă",
  "admin_dash_title": "Admin Panel",
  "admin_dash_pending_drivers": "Șoferi în Așteptare",
  "admin_dash_active_drivers": "Șoferi Activi",
  "admin_dash_actions_title": "Acțiuni Rapide",
  "admin_dash_actions_desc": "Folosește tab-urile de mai jos pentru a gestiona verificarea șoferilor, alertele SOS și configurația platformei.",
  "admin_drivers_title": "Verificare Șoferi",
  "admin_drivers_filter_all": "Toți",
  "admin_drivers_filter_pending": "În Așteptare",
  "admin_drivers_filter_approved": "Aprobați",
  "admin_drivers_empty": "Niciun șofer",
  "admin_drivers_btn_approve": "Aprobă",
  "admin_drivers_btn_reject": "Respinge",
  "admin_drivers_approved_alert_title": "Aprobare",
  "admin_drivers_approved_alert": "Șoferul a fost aprobat și are 3 luni trial.",
  "admin_drivers_rejected_alert_title": "Aprobare",
  "admin_drivers_rejected_alert": "Șoferul a fost respins.",
  "admin_drivers_error_approve": "Nu s-a putut aproba șoferul.",
  "admin_drivers_error_reject": "Nu s-a putut respinge șoferul.",
  "admin_settings_title": "Configurări Admin",
  "admin_settings_section_platform": "Platformă",
  "admin_settings_section_pricing": "Setări Prețuri",
  "admin_settings_label_min_price": "Preț minim cursă",
  "admin_settings_label_commission": "Comision platformă",
  "admin_settings_section_actions": "Acțiuni",
  "admin_settings_btn_logout": "Deconectare Admin",

  // Chat
  "chat_title": "Chat Cursă",
  "chat_placeholder": "Scrie un mesaj...",

  // DriverRequestCard
  "driver_card_btn_accept": "Acceptă",
  "driver_card_btn_ignore": "Ignoră",

  // Passes screens
  "passes_title": "Locații favorite",
  "passes_home": "Acasă",
  "passes_work": "Serviciu",
  "passes_add_btn": "Adaugă locație",
  "driver_passes_title": "Abonamentul meu",
  "driver_passes_status_pending": "Cont în verificare",
  "driver_passes_status_unregistered": "Cont neînregistrat",
  "driver_passes_trial_sub": "Prima lună gratuită",
  "driver_passes_plan_name": "Plan Standard",
  "driver_passes_plan_desc": "Acces complet la toate cursele",
  "driver_passes_plan_period": "RON/lună",
  "driver_passes_plan_feature_1": "Cereri curse nelimitate",
  "driver_passes_btn_activate": "Activează abonament",
  "driver_passes_bank_connected": "Conectat",
  "driver_passes_bank_disconnected": "Neconectat — conectează pentru a primi plăți",
  "driver_passes_bank_section": "Cont bancar",
  "driver_passes_btn_setup": "Configurează",
};

const replacements = {
  "app/(auth)/login.tsx": [
    { search: "setError('Completează toate câmpurile.');", replace: "setError(t('login_error_empty_fields'));" },
    { search: "setError(err?.message ?? 'Autentificare eșuată. Verifică datele și încearcă din nou.');", replace: "setError(err?.message ?? t('login_error_auth_failed'));" },
    { search: "<Text style={styles.title}>Bun venit înapoi</Text>", replace: "<Text style={styles.title}>{t('login_welcome_back')}</Text>" },
    { search: "<Text style={styles.subtitle}>Conectează-te la contul tău</Text>", replace: "<Text style={styles.subtitle}>{t('login_subtitle')}</Text>" },
    { search: "<Text style={styles.label}>Email</Text>", replace: "<Text style={styles.label}>{t('login_label_email')}</Text>" },
    { search: "<Text style={styles.label}>Parolă</Text>", replace: "<Text style={styles.label}>{t('login_label_password')}</Text>" },
    { search: 'placeholder="Minim 6 caractere"', replace: 'placeholder={t(\'login_placeholder_password\')}' },
    { search: "<Text style={styles.btnPrimaryText}>Conectează-te</Text>", replace: "<Text style={styles.btnPrimaryText}>{t('login_btn_submit')}</Text>" },
    { search: "<Text style={styles.footerText}>Nu ai cont? </Text>", replace: "<Text style={styles.footerText}>{t('login_no_account_spaced')}</Text>" },
    { search: "<Text style={[styles.footerText, styles.footerLink]}>Înregistrează-te</Text>", replace: "<Text style={[styles.footerText, styles.footerLink]}>{t('login_link_register')}</Text>" }
  ],
  "app/(auth)/register.tsx": [
    { search: "setError('Completează toate câmpurile obligatorii.');", replace: "setError(t('register_error_empty_fields'));" },
    { search: "setError('Parola trebuie să aibă minim 6 caractere.');", replace: "setError(t('register_error_password_length'));" },
    { search: "setError('Completează datele vehiculului.');", replace: "setError(t('register_error_vehicle_data'));" },
    { search: "setError(err?.message ?? 'Înregistrare eșuată. Încearcă din nou.');", replace: "setError(err?.message ?? t('register_error_failed'));" },
    { search: "<Text style={styles.title}>Creează cont</Text>", replace: "<Text style={styles.title}>{t('register_btn_submit')}</Text>" },
    { search: "<Text style={styles.subtitle}>Gratuit. Fără comision.</Text>", replace: "<Text style={styles.subtitle}>{t('register_subtitle')}</Text>" },
    { search: "{r === 'passenger' ? 'Pasager' : 'Șofer'}", replace: "{r === 'passenger' ? t('role_passenger') : t('role_driver')}" },
    { search: 'label="Nume complet" placeholder="Ion Popescu"', replace: 'label={t(\'register_label_name\')} placeholder={t(\'register_placeholder_name\')}' },
    { search: 'label="Email" placeholder="adresa@email.com"', replace: 'label={t(\'register_label_email\')} placeholder={t(\'register_placeholder_email\')}' },
    { search: 'label="Număr de telefon" placeholder="+40 7xx xxx xxx"', replace: 'label={t(\'register_label_phone\')} placeholder={t(\'register_placeholder_phone\')}' },
    { search: "<Text style={styles.label}>Parolă</Text>", replace: "<Text style={styles.label}>{t('register_label_password')}</Text>" },
    { search: 'placeholder="Minim 6 caractere"', replace: 'placeholder={t(\'register_placeholder_password\')}' },
    { search: "<Text style={styles.dividerText}>Detalii vehicul</Text>", replace: "<Text style={styles.dividerText}>{t('register_section_vehicle')}</Text>" },
    { search: 'label="Marcă" placeholder="ex: Toyota"', replace: 'label={t(\'register_label_car_make\')} placeholder={t(\'register_placeholder_car_make\')}' },
    { search: 'label="Model" placeholder="ex: Camry"', replace: 'label={t(\'register_label_car_model\')} placeholder={t(\'register_placeholder_car_model\')}' },
    { search: 'label="Număr înmatriculare" placeholder="ex: B 123 ABC"', replace: 'label={t(\'register_label_car_plate\')} placeholder={t(\'register_placeholder_car_plate\')}' },
    { search: "Vei putea adăuga poza vehiculului și documentele la pasul următor. Contul va fi activat după verificarea manuală a documentelor.", replace: "{t('register_driver_note')}" },
    { search: "<Text style={styles.btnPrimaryText}>Creează cont</Text>", replace: "<Text style={styles.btnPrimaryText}>{t('register_btn_submit')}</Text>" },
    { search: "<Text style={styles.footerText}>Ai deja cont? </Text>", replace: "<Text style={styles.footerText}>{t('register_have_account_spaced')}</Text>" },
    { search: "<Text style={[styles.footerText, styles.footerLink]}>Conectează-te</Text>", replace: "<Text style={[styles.footerText, styles.footerLink]}>{t('register_link_login')}</Text>" }
  ],
  "app/(auth)/language.tsx": [
    { search: '<Text style={styles.title}>Alege limba</Text>', replace: '<Text style={styles.title}>{t(\'lang_title\')}</Text>' },
    { search: '<Text style={styles.subtitle}>Select language / Choisissez la langue</Text>', replace: '<Text style={styles.subtitle}>{t(\'lang_subtitle\')}</Text>' },
    { search: '<Button label="Continuă" fullWidth size="lg" icon="arrow-forward" onPress={handleContinue} />', replace: '<Button label={t(\'lang_btn_continue\')} fullWidth size="lg" icon="arrow-forward" onPress={handleContinue} />' }
  ],
  "app/(passenger)/_layout.tsx": [
    { search: "title: 'Cursă',", replace: "title: t('tab_passenger_ride')," },
    { search: "title: 'Istoricul meu',", replace: "title: t('tab_passenger_history')," },
    { search: "title: 'Locații',", replace: "title: t('tab_passenger_passes')," },
    { search: "title: 'Profil',", replace: "title: t('tab_passenger_profile')," }
  ],
  "app/(driver)/_layout.tsx": [
    { search: "title: 'Drive/Radar',", replace: "title: t('tab_driver_drive')," },
    { search: "title: 'Abonament',", replace: "title: t('tab_driver_subscription')," },
    { search: "title: 'Rides',", replace: "title: t('tab_driver_rides')," },
    { search: "title: 'Profil',", replace: "title: t('tab_driver_profile')," }
  ],
  "app/(admin)/_layout.tsx": [
    { search: "title: 'Șoferi',", replace: "title: t('tab_admin_drivers')," }
  ],
  "app/(passenger)/ride.tsx": [
    { search: "Salut, {user?.name?.split(' ')[0] ?? 'pasager'} 👋", replace: "{t('ride_greeting_prefix')}{user?.name?.split(' ')[0] ?? t('ride_greeting_fallback')} 👋" },
    { search: "<Text style={styles.sub}>Unde te ducem azi?</Text>", replace: "<Text style={styles.sub}>{t('ride_greeting_subtitle')}</Text>" },
    { search: "<Text style={styles.searchText}>Unde mergi?</Text>", replace: "<Text style={styles.searchText}>{t('ride_search_placeholder')}</Text>" },
    { search: "<Text style={styles.activeTitle}>Cursă în desfășurare</Text>", replace: "<Text style={styles.activeTitle}>{t('ride_active_banner_title')}</Text>" }
  ],
  "app/(passenger)/request.tsx": [
    { search: "<Text>Alege o destinație mai întâi.</Text>", replace: "<Text>{t('request_error_no_destination')}</Text>" },
    { search: 'label="Înapoi"', replace: 'label={t(\'common_back\')}' },
    { search: "<Text style={styles.sectionTitle}>Alege clasa</Text>", replace: "<Text style={styles.sectionTitle}>{t('request_class_title')}</Text>" },
    { search: "<Text style={styles.sectionTitle}>Oferă un preț</Text>", replace: "<Text style={styles.sectionTitle}>{t('request_price_title')}</Text>" },
    { search: '<Text style={styles.priceSub}>Sugerăm {basePrice} {CURRENCY}. Crește oferta pentru a găsi șofer mai repede.</Text>', replace: '<Text style={styles.priceSub}>{t(\'request_price_sub\', { basePrice, currency: CURRENCY })}</Text>' },
    { search: 'label={isSubmitting ? "Se trimite..." : "Trimite solicitarea"}', replace: 'label={isSubmitting ? t(\'request_btn_submitting\') : t(\'request_btn_submit\')}' },
    { search: "name: 'AERO', desc: 'Curse rapide și accesibile'", replace: "name: t('request_class_aero_name'), desc: t('request_class_aero_desc')" },
    { search: "name: 'AERO+', desc: 'Mașini mai spațioase'", replace: "name: t('request_class_plus_name'), desc: t('request_class_plus_desc')" },
    { search: "name: 'VIP', desc: 'Premium & Business'", replace: "name: t('request_class_vip_name'), desc: t('request_class_vip_desc')" }
  ],
  "app/(passenger)/searching.tsx": [
    { search: "<Text style={styles.searchingText}>Căutăm șoferi în apropiere...</Text>", replace: "<Text style={styles.searchingText}>{t('searching_text')}</Text>" },
    { search: 'label="Anulează"', replace: 'label={t(\'searching_cancel_btn\')}' },
    { search: '<Text style={styles.offersTitle}>Oferte primite ({offers.length})</Text>', replace: '<Text style={styles.offersTitle}>{t(\'searching_offers_title\', { count: offers.length })}</Text>' },
    { search: 'label="Acceptă oferta"', replace: 'label={t(\'searching_accept_offer_btn\')}' }
  ],
  "app/(passenger)/active.tsx": [
    { search: "rideStep === 'going_to_pickup' ? 'Șoferul este pe drum' : rideStep === 'arrived' ? 'Așteptare pasager' : 'Cursa este în desfășurare'", replace: "rideStep === 'going_to_pickup' ? t('active_status_ontheway') : rideStep === 'arrived' ? t('active_status_waiting') : t('active_status_inprogress')" },
    { search: "showAlert('SOS Activ', 'Echipa AERO a fost alertată și monitorizează cursa!');", replace: "showAlert(t('active_sos_alerted_title'), t('active_sos_alerted'));" },
    { search: "tone === 'arrived' ? 'Aproape ați ajuns' : ''", replace: "tone === 'arrived' ? t('active_status_arrived') : ''" },
    { search: "<Text style={styles.actionText}>Chat</Text>", replace: "<Text style={styles.actionText}>{t('active_chat_btn')}</Text>" },
    { search: "<Text style={styles.actionText}>SOS</Text>", replace: "<Text style={styles.actionText}>{t('active_sos_btn')}</Text>" },
    { search: "<Text style={styles.actionText}>Share</Text>", replace: "<Text style={styles.actionText}>{t('active_share_btn')}</Text>" },
    { search: "<Text style={styles.actionText}>Finalizează</Text>", replace: "<Text style={styles.actionText}>{t('active_complete_btn')}</Text>" },
    { search: 'label="Închide"', replace: 'label={t(\'active_close_btn\')}' },
    { search: 'label="Waze"', replace: 'label={t(\'active_waze_btn\')}' },
    { search: 'label="Google Maps"', replace: 'label={t(\'active_maps_btn\')}' }
  ],
  "app/(passenger)/rating.tsx": [
    { search: "<Text style={styles.title}>Ai ajuns la destinație!</Text>", replace: "<Text style={styles.title}>{t('rating_headline')}</Text>" },
    { search: "<Text style={styles.sub}>Cum a fost cursa cu {activeRide.offer.driverName}?</Text>", replace: "<Text style={styles.sub}>{t('rating_subtext', { driverName: activeRide.offer.driverName })}</Text>" },
    { search: 'placeholder="Adaugă un comentariu (opțional)..."', replace: 'placeholder={t(\'rating_comment_placeholder\')}' },
    { search: 'label="Trimite review"', replace: 'label={t(\'rating_submit_btn\')}' },
    { search: 'label="Omite pentru moment"', replace: 'label={t(\'rating_skip_btn\')}' }
  ],
  "app/(passenger)/profile.tsx": [
    { search: "<Text style={styles.sectionTitle}>Contul Meu</Text>", replace: "<Text style={styles.sectionTitle}>{t('profile_section_account')}</Text>" },
    { search: "Fără număr", replace: "{t('profile_no_phone')}" },
    { search: "<Text style={styles.rowText}>Limbă / Language</Text>", replace: "<Text style={styles.rowText}>{t('profile_language')}</Text>" },
    { search: "<Text style={styles.rowText}>Dark Mode</Text>", replace: "<Text style={styles.rowText}>{t('profile_dark_mode')}</Text>" },
    { search: "<Text style={styles.rowSub}>Tema va fi aplicată după repornirea aplicației (Mock).</Text>", replace: "<Text style={styles.rowSub}>{t('profile_dark_mode_note')}</Text>" },
    { search: "<Text style={styles.rowText}>Suport & Ajutor</Text>", replace: "<Text style={styles.rowText}>{t('profile_support_help')}</Text>" },
    { search: "<Text style={styles.rowText}>Deconectare</Text>", replace: "<Text style={styles.rowText}>{t('profile_logout_title')}</Text>" },
    { search: "Deconectează-mă", replace: "{t('profile_logout_confirm')}" },
    { search: "Ești sigur?", replace: "{t('profile_logout_message')}" },
    { search: "Anulează", replace: "{t('profile_logout_cancel')}" }
  ],
  "app/(driver)/profile.tsx": [
    { search: "<Text style={styles.sectionTitle}>Contul Meu</Text>", replace: "<Text style={styles.sectionTitle}>{t('profile_section_account')}</Text>" },
    { search: "Fără număr", replace: "{t('profile_no_phone')}" },
    { search: "<Text style={styles.sectionTitle}>Setări Șofer</Text>", replace: "<Text style={styles.sectionTitle}>{t('profile_section_driver_settings')}</Text>" },
    { search: "<Text style={styles.rowText}>Abonament AERO</Text>", replace: "<Text style={styles.rowText}>{t('profile_subscription_title')}</Text>" },
    { search: "Trial activ ({trialDaysLeft} zile)", replace: "{t('profile_trial_active', { days: trialDaysLeft })}" },
    { search: "În Așteptare", replace: "{t('profile_status_pending')}" },
    { search: "<Text style={styles.rowText}>Mașina Mea</Text>", replace: "<Text style={styles.rowText}>{t('profile_my_car')}</Text>" },
    { search: "<Text style={styles.sectionTitle}>Preferințe Aplicație</Text>", replace: "<Text style={styles.sectionTitle}>{t('profile_section_prefs')}</Text>" },
    { search: "<Text style={styles.rowText}>Limbă / Language</Text>", replace: "<Text style={styles.rowText}>{t('profile_language')}</Text>" },
    { search: "<Text style={styles.rowText}>Dark Mode</Text>", replace: "<Text style={styles.rowText}>{t('profile_dark_mode')}</Text>" },
    { search: "<Text style={styles.rowSub}>Tema va fi aplicată după repornirea aplicației (Mock).</Text>", replace: "<Text style={styles.rowSub}>{t('profile_dark_mode_note')}</Text>" },
    { search: "<Text style={styles.rowText}>Suport & Ajutor</Text>", replace: "<Text style={styles.rowText}>{t('profile_support_help')}</Text>" },
    { search: "<Text style={styles.rowText}>Deconectare</Text>", replace: "<Text style={styles.rowText}>{t('profile_logout_title')}</Text>" },
    { search: "Deconectează-mă", replace: "{t('profile_logout_confirm')}" },
    { search: "Ești sigur?", replace: "{t('profile_logout_message')}" },
    { search: "Anulează", replace: "{t('profile_logout_cancel')}" }
  ],
  "app/(passenger)/rides.tsx": [
    { search: "<Text style={styles.summaryLabel}>Curse totale</Text>", replace: "<Text style={styles.summaryLabel}>{t('rides_total_rides')}</Text>" },
    { search: "<Text style={styles.summaryLabel}>Rating mediu</Text>", replace: "<Text style={styles.summaryLabel}>{t('rides_average_rating')}</Text>" },
    { search: "<Text style={styles.emptyTitle}>Nicio cursă încă</Text>", replace: "<Text style={styles.emptyTitle}>{t('rides_empty_title')}</Text>" },
    { search: "<Text style={styles.emptyText}>Cursele tale vor apărea după finalizare</Text>", replace: "<Text style={styles.emptyText}>{t('rides_empty_subtitle')}</Text>" }
  ],
  "app/(driver)/rides.tsx": [
    { search: "<Text style={styles.summaryLabel}>Curse totale</Text>", replace: "<Text style={styles.summaryLabel}>{t('rides_total_rides')}</Text>" },
    { search: "<Text style={styles.summaryLabel}>Câștiguri totale</Text>", replace: "<Text style={styles.summaryLabel}>{t('rides_total_earnings')}</Text>" },
    { search: "<Text style={styles.summaryLabel}>Rating mediu</Text>", replace: "<Text style={styles.summaryLabel}>{t('rides_average_rating')}</Text>" },
    { search: "<Text style={styles.emptyTitle}>Nicio cursă încă</Text>", replace: "<Text style={styles.emptyTitle}>{t('rides_empty_title')}</Text>" },
    { search: "<Text style={styles.emptyText}>Cursele tale vor apărea după finalizare</Text>", replace: "<Text style={styles.emptyText}>{t('rides_empty_subtitle')}</Text>" }
  ],
  "app/(driver)/drive.tsx": [
    { search: "<Text style={styles.bigTitle}>Devino Șofer AERO</Text>", replace: "<Text style={styles.bigTitle}>{t('driver_onboarding_title')}</Text>" },
    { search: "Comisionul AERO este 0% — banii merg direct la tine.", replace: "{t('driver_onboarding_lead')}" },
    { search: 'text="Plăți directe în contul tău (Stripe Connect)"', replace: 'text={t(\'driver_benefit_payments\')}' },
    { search: 'text="1 lună gratuită la aprobare"', replace: 'text={t(\'driver_benefit_trial\')}' },
    { search: 'text="Tu controlezi prețul prin contraoferte"', replace: 'text={t(\'driver_benefit_negotiation\')}' },
    { search: 'text="Destinația vizibilă înainte de acceptare"', replace: 'text={t(\'driver_benefit_destination\')}' },
    { search: 'label="Începe înregistrarea"', replace: 'label={t(\'driver_onboarding_btn\')}' },
    { search: "Deconectare", replace: "{t('profile_logout_title')}" },
    { search: "Deconectează-mă", replace: "{t('profile_logout_confirm')}" },
    { search: "Ești sigur?", replace: "{t('profile_logout_message')}" },
    { search: "Anulează", replace: "{t('profile_logout_cancel')}" },
    { search: "<Text style={styles.bigTitle}>Documente în verificare</Text>", replace: "<Text style={styles.bigTitle}>{t('driver_pending_title')}</Text>" },
    { search: "<Text style={styles.lead}>Echipa AERO îți verifică actele. Vei putea prelua curse imediat după aprobare.</Text>", replace: "<Text style={styles.lead}>{t('driver_pending_text')}</Text>" },
    { search: 'label="Simulează aprobarea"', replace: 'label={t(\'driver_pending_btn_simulate\')}' },
    { search: "<Text style={styles.bigTitle}>Abonament expirat</Text>", replace: "<Text style={styles.bigTitle}>{t('driver_expired_title')}</Text>" },
    { search: "<Text style={styles.lead}>Reînnoiește abonamentul pentru a relua cursele.</Text>", replace: "<Text style={styles.lead}>{t('driver_expired_text')}</Text>" },
    { search: 'label="Alege Abonament (50 RON/lună)"', replace: 'label={t(\'driver_expired_btn_choose\')}' },
    { search: 'label="Activează Mock"', replace: 'label={t(\'driver_expired_btn_mock\')}' },
    { search: "isOnline ? 'Online · primești comenzi' : 'Offline'", replace: "isOnline ? t('driver_radar_online') : t('driver_radar_offline')" },
    { search: "<Text style={styles.goOnlineText}>Intră Online</Text>", replace: "<Text style={styles.goOnlineText}>{t('driver_radar_btn_online')}</Text>" },
    { search: "<Text style={styles.offlineLink}>Ieși Offline</Text>", replace: "<Text style={styles.offlineLink}>{t('driver_radar_btn_offline')}</Text>" },
    { search: "<Text style={styles.reqTitle}>Cereri în apropiere</Text>", replace: "<Text style={styles.reqTitle}>{t('driver_radar_requests_title')}</Text>" },
    { search: "<Text style={styles.noReq}>Nu sunt cereri momentan. Stai online.</Text>", replace: "<Text style={styles.noReq}>{t('driver_radar_no_requests')}</Text>" },
    { search: "label={rideStep === 'going_to_pickup' ? 'Navighează spre preluare' : rideStep === 'arrived' ? 'Așteptare pasager' : 'Cursă în desfășurare'}", replace: "label={rideStep === 'going_to_pickup' ? t('active_status_ontheway') : rideStep === 'arrived' ? t('active_status_waiting') : t('active_status_inprogress')}" },
    { search: 'label="Navighează (Waze / Maps)"', replace: 'label={t(\'driver_ride_btn_nav_pickup\')}' },
    { search: 'label="Chat"', replace: 'label={t(\'active_chat_btn\')}' },
    { search: 'label="SOS"', replace: 'label={t(\'active_sos_btn\')}' },
    { search: 'label="Am ajuns la Preluare"', replace: 'label={t(\'driver_ride_btn_arrived\')}' },
    { search: 'label="Apelează"', replace: 'label={t(\'active_call_btn\')}' },
    { search: 'label="Începe Cursa"', replace: 'label={t(\'driver_ride_btn_start\')}' },
    { search: 'label="Navighează spre Destinație"', replace: 'label={t(\'driver_ride_btn_nav_dropoff\')}' },
    { search: 'label="Finalizează cursa"', replace: 'label={t(\'driver_ride_btn_complete\')}' },
    { search: "showAlert('Apel', 'Apelare 0722000000...');", replace: "showAlert(t('active_call_btn'), t('active_call_dialing'));" },
    { search: "showAlert('SOS Activ', 'AERO a fost alertat!');", replace: "showAlert(t('active_sos_btn'), t('active_sos_alerted'));" },
    { search: "showAlert('Cursă finalizată', `Pasagerul a plătit ${r.finalPrice} ${CURRENCY}. Mulțumim!`);", replace: "showAlert(t('driver_ride_complete_alert_title'), t('driver_ride_complete_alert_msg', { price: r.finalPrice, currency: CURRENCY }));" }
  ],
  "app/(driver)/subscription.tsx": [
    { search: "<Text style={styles.heroTitle}>AERO Flex</Text>", replace: "<Text style={styles.heroTitle}>{t('sub_title')}</Text>" },
    { search: "<Text style={styles.heroSub}>Păstrezi 100% din banii pe cursă, cu 0 comision.</Text>", replace: "<Text style={styles.heroSub}>{t('sub_hero_desc')}</Text>" },
    { search: "<Text style={styles.sectionTitle}>Ce include abonamentul?</Text>", replace: "<Text style={styles.sectionTitle}>{t('sub_benefits_title')}</Text>" },
    { search: 'text="Comision 0% — păstrezi 100% din cursă"', replace: 'text={t(\'sub_benefit_1\')}' },
    { search: 'text="Acces complet la toate cursele"', replace: 'text={t(\'sub_benefit_2\')}' },
    { search: 'text="Chat + navigație integrată"', replace: 'text={t(\'sub_benefit_3\')}' },
    { search: 'text="Plăți zilnice direct în contul tău"', replace: 'text={t(\'sub_benefit_4\')}' },
    { search: 'label="Plătește sigur prin Stripe"', replace: 'label={t(\'sub_btn_pay\')}' },
    { search: "Plata este securizată de Stripe. Abonamentul se va reînnoi automat în fiecare lună. Poți anula oricând din setări.", replace: "{t('sub_footer_text')}" },
    { search: "showAlert('Abonament AERO', 'Abonamentul AERO Flex a fost activat! Poți prelua curse din nou.');", replace: "showAlert(t('sub_title'), t('sub_success_message'));" },
    { search: 'label="Se procesează plata..."', replace: 'label={t(\'sub_processing\')}' }
  ],
  "app/(admin)/alerts.tsx": [
    { search: "<Text style={styles.headerTitle}>Alerte & Rapoarte</Text>", replace: "<Text style={styles.headerTitle}>{t('admin_alerts_title')}</Text>" },
    { search: "<Text style={styles.headerSub}>Live monitoring · Realtime</Text>", replace: "<Text style={styles.headerSub}>{t('admin_alerts_subtitle')}</Text>" },
    { search: "<Text style={styles.emptyText}>Nicio alertă activă</Text>", replace: "<Text style={styles.emptyText}>{t('admin_alerts_empty')}</Text>" }
  ],
  "app/(admin)/dashboard.tsx": [
    { search: "<Text style={styles.headerTitle}>Admin Panel</Text>", replace: "<Text style={styles.headerTitle}>{t('admin_dash_title')}</Text>" },
    { search: 'label="Șoferi în Așteptare"', replace: 'label={t(\'admin_dash_pending_drivers\')}' },
    { search: 'label="Șoferi Activi"', replace: 'label={t(\'admin_dash_active_drivers\')}' },
    { search: "<Text style={styles.sectionTitle}>Acțiuni Rapide</Text>", replace: "<Text style={styles.sectionTitle}>{t('admin_dash_actions_title')}</Text>" },
    { search: "Folosește tab-urile de mai jos pentru a gestiona verificarea șoferilor, alertele SOS și configurația platformei.", replace: "{t('admin_dash_actions_desc')}" }
  ],
  "app/(admin)/drivers.tsx": [
    { search: "<Text style={styles.headerTitle}>Verificare Șoferi</Text>", replace: "<Text style={styles.headerTitle}>{t('admin_drivers_title')}</Text>" },
    { search: "{f === 'pending' ? 'În Așteptare' : f === 'approved' ? 'Aprobați' : 'Toți'}", replace: "{f === 'pending' ? t('admin_drivers_filter_pending') : f === 'approved' ? t('admin_drivers_filter_approved') : t('admin_drivers_filter_all')}" },
    { search: "<Text style={styles.emptyText}>Niciun șofer {filter === 'pending' ? 'în așteptare' : ''}</Text>", replace: "<Text style={styles.emptyText}>{t('admin_drivers_empty')}</Text>" },
    { search: "<Text style={styles.actionText}>Aprobă</Text>", replace: "<Text style={styles.actionText}>{t('admin_drivers_btn_approve')}</Text>" },
    { search: "<Text style={styles.actionText}>Respinge</Text>", replace: "<Text style={styles.actionText}>{t('admin_drivers_btn_reject')}</Text>" },
    { search: "showAlert('Aprobare', 'Șoferul a fost aprobat și are 3 luni trial.');", replace: "showAlert(t('admin_drivers_approved_alert_title'), t('admin_drivers_approved_alert'));" },
    { search: "showAlert('Aprobare', 'Șoferul a fost respins.');", replace: "showAlert(t('admin_drivers_rejected_alert_title'), t('admin_drivers_rejected_alert'));" },
    { search: "showAlert('Eroare', 'Nu s-a putut aproba șoferul.');", replace: "showAlert(t('common_error'), t('admin_drivers_error_approve'));" },
    { search: "showAlert('Eroare', 'Nu s-a putut respinge șoferul.');", replace: "showAlert(t('common_error'), t('admin_drivers_error_reject'));" }
  ],
  "app/(admin)/settings.tsx": [
    { search: "<Text style={styles.headerTitle}>Configurări Admin</Text>", replace: "<Text style={styles.headerTitle}>{t('admin_settings_title')}</Text>" },
    { search: "<Text style={styles.sectionTitle}>Platformă</Text>", replace: "<Text style={styles.sectionTitle}>{t('admin_settings_section_platform')}</Text>" },
    { search: 'label="Preț minim cursă"', replace: 'label={t(\'admin_settings_label_min_price\')}' },
    { search: 'label="Comision platformă"', replace: 'label={t(\'admin_settings_label_commission\')}' },
    { search: "<Text style={styles.sectionTitle}>Setări Prețuri</Text>", replace: "<Text style={styles.sectionTitle}>{t('admin_settings_section_pricing')}</Text>" },
    { search: "<Text style={styles.sectionTitle}>Acțiuni</Text>", replace: "<Text style={styles.sectionTitle}>{t('admin_settings_section_actions')}</Text>" },
    { search: "<Text style={styles.dangerText}>Deconectare Admin</Text>", replace: "<Text style={styles.dangerText}>{t('admin_settings_btn_logout')}</Text>" }
  ],
  "app/chat/[rideId].tsx": [
    { search: "<Text style={styles.headerTitle}>Chat Cursă</Text>", replace: "<Text style={styles.headerTitle}>{t('chat_title')}</Text>" },
    { search: 'placeholder="Scrie un mesaj..."', replace: 'placeholder={t(\'chat_placeholder\')}' }
  ],
  "components/feature/DriverRequestCard.tsx": [
    { search: "<Text style={styles.acceptText}>Acceptă</Text>", replace: "<Text style={styles.acceptText}>{t('driver_card_btn_accept')}</Text>" },
    { search: "<Text style={styles.ignoreText}>Ignoră</Text>", replace: "<Text style={styles.ignoreText}>{t('driver_card_btn_ignore')}</Text>" }
  ],
  "app/(passenger)/passes.tsx": [
    { search: '<Header title="Locații favorite" />', replace: '<Header title={t(\'passes_title\')} />' },
    { search: "label: 'Acasă',", replace: "label: t('passes_home')," },
    { search: "label: 'Serviciu',", replace: "label: t('passes_work')," },
    { search: "<Text style={styles.addText}>Adaugă locație</Text>", replace: "<Text style={styles.addText}>{t('passes_add_btn')}</Text>" }
  ],
  "app/(driver)/passes.tsx": [
    { search: '<Header title="Abonamentul meu" />', replace: '<Header title={t(\'driver_passes_title\')} />' },
    { search: "driverStatus === 'approved' && isTrialActive\n                  ? `Trial activ — ${trialDaysLeft} zile rămase`\n                  : driverStatus === 'approved'\n                  ? 'Abonament expirat'\n                  : driverStatus === 'pending'\n                  ? 'Cont în verificare'\n                  : 'Cont neînregistrat'", replace: "driverStatus === 'approved' && isTrialActive\n                  ? t('profile_trial_active', { days: trialDaysLeft })\n                  : driverStatus === 'approved'\n                  ? t('driver_expired_title')\n                  : driverStatus === 'pending'\n                  ? t('driver_passes_status_pending')\n                  : t('driver_passes_status_unregistered')" },
    { search: "isTrialActive\n                  ? 'Prima lună gratuită'\n                  : 'Reînnoiește pentru a prelua curse'", replace: "isTrialActive\n                  ? t('driver_passes_trial_sub')\n                  : t('driver_expired_text')" },
    { search: "<Text style={styles.sectionLabel}>Plan disponibil</Text>", replace: "<Text style={styles.sectionLabel}>{t('driver_passes_plan_name')}</Text>" },
    { search: "<Text style={styles.planName}>Plan Standard</Text>", replace: "<Text style={styles.planName}>{t('driver_passes_plan_name')}</Text>" },
    { search: "<Text style={styles.planDesc}>Acces complet la toate cursele</Text>", replace: "<Text style={styles.planDesc}>{t('driver_passes_plan_desc')}</Text>" },
    { search: "<Text style={styles.planCurrency}>RON/lună</Text>", replace: "<Text style={styles.planCurrency}>{t('driver_passes_plan_period')}</Text>" },
    { search: 'text="Comision 0% — păstrezi 100% din cursă"', replace: 'text={t(\'sub_benefit_1\')}' },
    { search: 'text="Cereri curse nelimitate"', replace: 'text={t(\'driver_passes_plan_feature_1\')}' },
    { search: 'text="Chat + navigație integrată"', replace: 'text={t(\'sub_benefit_3\')}' },
    { search: 'text="Prima lună gratuită"', replace: 'text={t(\'driver_passes_trial_sub\')}' },
    { search: 'label="Activează abonament"', replace: 'label={t(\'driver_passes_btn_activate\')}' },
    { search: 'onPress={() => showAlert(\'Stripe\', \'Integrare Stripe Subscriptions — disponibil în curând.\')}', replace: 'onPress={() => showAlert(t(\'sub_title\'), t(\'driver_passes_btn_activate_stripe_mock\'))}' },
    { search: "<Text style={styles.sectionLabel}>Cont bancar</Text>", replace: "<Text style={styles.sectionLabel}>{t('driver_passes_bank_section')}</Text>" },
    { search: "user?.vehicle ? 'Conectat' : 'Neconectat — conectează pentru a primi plăți'", replace: "user?.vehicle ? t('driver_passes_bank_connected') : t('driver_passes_bank_disconnected')" },
    { search: 'onPress={() => showAlert(\'Stripe Connect\', \'Onboarding Stripe — disponibil în curând.\')}', replace: 'onPress={() => showAlert(t(\'driver_passes_bank_section\'), t(\'driver_passes_bank_onboarding_mock\'))}' },
    { search: "<Text style={styles.bankBtnText}>Configurează</Text>", replace: "<Text style={styles.bankBtnText}>{t('driver_passes_btn_setup')}</Text>" }
  ]
};

// Add extra alerts to the ROMANIAN_UI_STRINGS that are referenced in replacements
ROMANIAN_UI_STRINGS["driver_passes_btn_activate_stripe_mock"] = "Integrare Stripe Subscriptions — disponibil în curând.";
ROMANIAN_UI_STRINGS["driver_passes_bank_onboarding_mock"] = "Onboarding Stripe — disponibil în curând.";

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
  console.log("Starting full application translation to 23 languages...");
  
  const keys = Object.keys(ROMANIAN_UI_STRINGS);
  const romanianTexts = Object.values(ROMANIAN_UI_STRINGS);
  
  const allTranslations = {};
  
  for (const lang of LANGUAGES) {
    console.log(`Translating to [${lang}]...`);
    const translatedTexts = await translateStrings(romanianTexts, lang);
    
    allTranslations[lang] = {};
    for (let i = 0; i < keys.length; i++) {
      allTranslations[lang][keys[i]] = translatedTexts[i];
    }
    
    // Polite delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log("All translations completed successfully!");
  
  // Write locales.ts
  const localesPath = path.join("c:", "Users", "LucianCebuc", "AERO", "constants", "locales.ts");
  
  let localesContent = `export const translations = ${JSON.stringify(allTranslations, null, 2)};\n\n`;
  localesContent += `export type Language = keyof typeof translations;\n`;
  localesContent += `export type TranslationKey = keyof typeof translations.en;\n`;
  
  fs.writeFileSync(localesPath, localesContent, 'utf8');
  console.log(`Saved translation dictionary to: ${localesPath}`);
  
  // Process replacements
  console.log("Replacing hardcoded strings in application files...");
  
  const componentPatterns = [
    /export\s+default\s+function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{/,
    /export\s+default\s+function\s*\([^)]*\)\s*\{/,
    /export\s+default\s+(?:\(\)\s*=>|function\s*\(\))\s*\{/
  ];
  
  for (const [relPath, fileReps] of Object.entries(replacements)) {
    const filePath = path.join("c:", "Users", "LucianCebuc", "AERO", relPath.replace(/\//g, path.sep));
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Insert useI18n import
    if (!content.includes('useI18n')) {
      content = `import { useI18n } from '@/contexts/I18nContext';\n` + content;
    }
    
    // Insert hook call inside the component
    if (!content.includes('const { t } = useI18n()') && !content.includes('const { t } = useI18n(')) {
      let matched = false;
      for (const pattern of componentPatterns) {
        if (pattern.test(content)) {
          content = content.replace(pattern, (match) => `${match}\n  const { t } = useI18n();`);
          matched = true;
          break;
        }
      }
      if (!matched) {
        console.warn(`Could not insert useI18n hook into: ${filePath}`);
      }
    }
    
    // Perform replacements
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
  
  console.log("Done! All translations and code replacements applied.");
}

run().catch(console.error);
