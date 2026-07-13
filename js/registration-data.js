/**
 * Global Critical Thinkers — registration-data.js
 *
 * Static reference data shared across every registration step:
 *   - COUNTRIES: name list for the Country of Residence searchable combo
 *   - DIAL_CODES: { code, country } pairs for the WhatsApp country-code
 *     searchable combo (used for both participant and guardian numbers)
 *
 * Pure data, no DOM logic — registration.js consumes this.
 */

window.GCTRegistrationData = {
  COUNTRIES: [
    'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Philippines', 'Vietnam',
    'Brunei', 'Cambodia', 'Laos', 'Myanmar', 'Timor-Leste',
    'Australia', 'New Zealand',
    'United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile',
    'United Kingdom', 'Ireland', 'France', 'Germany', 'Netherlands', 'Belgium',
    'Switzerland', 'Austria', 'Spain', 'Portugal', 'Italy', 'Sweden', 'Norway',
    'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Greece', 'Hungary',
    'Romania', 'Ukraine', 'Russia',
    'China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'India', 'Pakistan',
    'Bangladesh', 'Sri Lanka', 'Nepal',
    'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Bahrain',
    'Oman', 'Jordan', 'Israel', 'Turkey', 'Egypt',
    'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Morocco',
    'Other'
  ],

  DIAL_CODES: [
    { code: '+62', country: 'Indonesia' },
    { code: '+60', country: 'Malaysia' },
    { code: '+65', country: 'Singapore' },
    { code: '+66', country: 'Thailand' },
    { code: '+63', country: 'Philippines' },
    { code: '+84', country: 'Vietnam' },
    { code: '+673', country: 'Brunei' },
    { code: '+855', country: 'Cambodia' },
    { code: '+856', country: 'Laos' },
    { code: '+95', country: 'Myanmar' },
    { code: '+670', country: 'Timor-Leste' },
    { code: '+61', country: 'Australia' },
    { code: '+64', country: 'New Zealand' },
    { code: '+1', country: 'United States / Canada' },
    { code: '+52', country: 'Mexico' },
    { code: '+55', country: 'Brazil' },
    { code: '+54', country: 'Argentina' },
    { code: '+56', country: 'Chile' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+353', country: 'Ireland' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+31', country: 'Netherlands' },
    { code: '+32', country: 'Belgium' },
    { code: '+41', country: 'Switzerland' },
    { code: '+43', country: 'Austria' },
    { code: '+34', country: 'Spain' },
    { code: '+351', country: 'Portugal' },
    { code: '+39', country: 'Italy' },
    { code: '+46', country: 'Sweden' },
    { code: '+47', country: 'Norway' },
    { code: '+45', country: 'Denmark' },
    { code: '+358', country: 'Finland' },
    { code: '+48', country: 'Poland' },
    { code: '+420', country: 'Czech Republic' },
    { code: '+30', country: 'Greece' },
    { code: '+36', country: 'Hungary' },
    { code: '+40', country: 'Romania' },
    { code: '+380', country: 'Ukraine' },
    { code: '+7', country: 'Russia' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+82', country: 'South Korea' },
    { code: '+886', country: 'Taiwan' },
    { code: '+852', country: 'Hong Kong' },
    { code: '+91', country: 'India' },
    { code: '+92', country: 'Pakistan' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+977', country: 'Nepal' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+974', country: 'Qatar' },
    { code: '+965', country: 'Kuwait' },
    { code: '+973', country: 'Bahrain' },
    { code: '+968', country: 'Oman' },
    { code: '+962', country: 'Jordan' },
    { code: '+972', country: 'Israel' },
    { code: '+90', country: 'Turkey' },
    { code: '+20', country: 'Egypt' },
    { code: '+27', country: 'South Africa' },
    { code: '+234', country: 'Nigeria' },
    { code: '+254', country: 'Kenya' },
    { code: '+233', country: 'Ghana' },
    { code: '+212', country: 'Morocco' }
  ]
};
