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
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
    'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
    'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei',
    'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile',
    'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Democratic Republic of the Congo',
    'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
    'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana',
    'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
    'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
    'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
    'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
    'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
    'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
    'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore',
    'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
    'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
    'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
    'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
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
  ],

  /* Step 2 — Research Topic Selection. Two age bands, each with its own
     fixed topic set. Keys match the <select> option values used in
     register-genesis-step2.html; descriptions power the Topic Preview
     box. registration-step2.js is the only file that reads this. */
  RESEARCH_TOPICS: {
    'young': {
      minAge: 11,
      maxAge: 14,
      topics: [
        {
          value: 'social-media-mental-health',
          label: 'Social Media & Mental Health',
          description: 'Explore how different countries address the impact of social media on young people\u2019s mental health, including online safety, cyberbullying, digital well-being, and government policies.'
        },
        {
          value: 'ai-in-education',
          label: 'AI in Education',
          description: 'Explore how countries integrate Artificial Intelligence into education, including classroom use, ethical considerations, accessibility, and national education policies.'
        }
      ]
    },
    'older': {
      minAge: 15,
      maxAge: 25,
      topics: [
        {
          value: 'youth-employment',
          label: 'Youth Employment',
          description: 'Explore how countries address youth unemployment through education, workforce development, entrepreneurship, and employment policies.'
        },
        {
          value: 'ai-governance',
          label: 'AI Governance',
          description: 'Explore how governments regulate Artificial Intelligence while balancing innovation, ethics, privacy, security, and public interest.'
        }
      ]
    }
  }
};
