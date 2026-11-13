# RecruiteTree — Accounting Integration Setup

Payroll approve hone ke baad uska **journal entry** (salaries, tax, social security, net pay) aapke accounting software me chala jata hai. Har company (legal entity) apni books alag connect karti hai. Jo software connect na ho, uske liye **CSV** journal download ho jati hai.

**Connect yahan se:** Settings → Accounting (per company), aur post yahan se: Payroll → koi run kholo → **Accounting** tab.

---

## 0. Pehle ye (sab providers ke liye zaroori)

1. **APP_URL set karo** (backend `.env`): aapka main https domain, e.g.
   ```
   APP_URL=https://recruitetree.com
   ```
   Isi se **Redirect URI** banti hai: `https://<APP_URL>/api/accounting/callback`

2. **Redirect URI khud app dikhata hai** — Settings → Accounting → koi OAuth provider chuno, screen par exact redirect address likha aata hai (`meta.redirectUri`). Bilkul wahi value provider ke app me daalni hai (copy-paste, trailing slash/space na ho).

3. **Keys do tareeqe se**:
   - **Per-company (aasaan):** UI me Client ID + Client Secret daal do.
   - **Platform-wide (shared):** backend `.env` me env vars set karo — phir har company bina keys ke "Connect" dabaye:
     ```
     ZOHO_CLIENT_ID=...        ZOHO_CLIENT_SECRET=...
     XERO_CLIENT_ID=...        XERO_CLIENT_SECRET=...
     QUICKBOOKS_CLIENT_ID=...  QUICKBOOKS_CLIENT_SECRET=...
     MYOB_CLIENT_ID=...        MYOB_CLIENT_SECRET=...
     ```
   (Odoo me OAuth nahi — niche dekho.)

> Connect ke baad **har company me chart-of-accounts mapping** set karni hai (10 lines: salaries, tax, net payable, etc. → aapke accounts). Mapping bina journal post nahi hoga.

---

## 1. Zoho Books  ✅ (ready)

- **App banao:** https://api-console.zoho.com → *Server-based Application*.
- **Redirect URI:** app wali exact `/api/accounting/callback`.
- **Data centre:** UI me chuno (com / eu / in / com.au / ca / sa / ae / jp). App bhi usi DC ke console me banana (accounts.zoho.<dc>).
- **Scopes (code khud bhejta hai):** `ZohoBooks.accountants.ALL,ZohoBooks.settings.READ`
- **Keys:** Client ID + Client Secret → UI me ya `ZOHO_*` env.
- **Drafts:** supported (journal draft me post kar sakte ho).
- Sandbox: Zoho me alag "trial org" bana ke usi account se test karo.

## 2. Xero  ✅ (ready)

- **App banao:** https://developer.xero.com/app/manage → *Web app*.
- **Redirect URI:** exact `/api/accounting/callback`.
- **Scopes (code bhejta hai):** `openid profile email offline_access accounting.manualjournals accounting.settings.read`
  (override: `XERO_SCOPES` env se.)
- **Keys:** Client ID + Client Secret → UI ya `XERO_*` env.
- **Org chunna:** connect ke baad agar multiple orgs hon to UI me "Xero organisation" dropdown.
- **Drafts:** supported. Sandbox: Xero ka **Demo Company** use karo.

## 3. QuickBooks Online  ✅ (ready)

- **App banao:** https://developer.intuit.com → *Dashboard* → new app → *QuickBooks Online Accounting*.
- **Redirect URI:** exact `/api/accounting/callback` (Keys & OAuth → Redirect URIs me, sandbox aur production dono me).
- **Scope (code bhejta hai):** `com.intuit.quickbooks.accounting`
- **Keys:** Development keys (sandbox) ya Production keys → UI ya `QUICKBOOKS_*` env.
- **Sandbox:** UI me **"QuickBooks sandbox (test company)"** checkbox on karo — API `sandbox-quickbooks.api.intuit.com` par jayegi. (Intuit ki same app sandbox + production dono chalati hai.)
- **Drafts:** QBO journals me draft nahi — isliye **two-person review** by-default on hai (ek banata hai, doosra owner/admin check kar ke post karta hai). Isi liye 2 admins chahiye (Settings → Team).

## 4. MYOB  🆕 (naya — `accounting.js` update karo)

> **Zaroori:** MYOB ab pehli dafa add hua hai. Naya `accounting.js` VPS par replace karna hai, phir restart.

- **App banao:** https://developer.myob.com → register → *Create app* (OAuth2). API Key = Client ID, aur Client Secret milega.
- **Redirect URI:** exact `/api/accounting/callback`.
- **Scope (code bhejta hai):** `CompanyFile`
- **Keys:** UI me Client ID + Client Secret, ya `MYOB_CLIENT_ID` / `MYOB_CLIENT_SECRET` env.
- **Company file chunna:** connect ke baad "Organisation" dropdown me apni MYOB company file chuno.
- **Online file:** yeh integration MYOB **cloud/online** company files ke liye hai (bearer token). (Desktop/on-prem AccountRight files ko `x-myobapi-cftoken` chahiye hota hai — abhi optional field se support hai par mainly online files ke liye banaya hai.)
- **Drafts:** MYOB GeneralJournal me draft nahi — isliye **two-person review** by-default on (QBO jaisa).
- **Endpoints (reference):** auth `secure.myob.com/oauth2/account/authorize`, token `secure.myob.com/oauth2/v1/authorize`, API `api.myob.com/accountright`.
- ⚠️ **Live test chahiye:** MYOB code bana hai par maine live run nahi kiya — aapke MYOB sandbox se pehla connect + ek test journal zaroor verify karna.

## 5. Odoo  ✅ (ready, OAuth nahi)

- **OAuth nahi** — direct API key.
- UI me do:
  - **Odoo address:** `https://yourcompany.odoo.com`
  - **Database:** db naam
  - **Login:** Odoo email
  - **API key:** Odoo → *My Profile* → *Account Security* → **New API Key**
- **Journal:** connect ke baad "Odoo journal" dropdown se general journal chuno.
- Versions 14–18 (JSON-RPC) aur 19+ (JSON-2) dono supported.
- **Drafts:** supported (draft move banta hai; "post as draft" off karo to seedha posted).

---

## Test karne ka tareeqa (har provider)

1. Settings → Accounting → company → provider chuno → **Connect** (OAuth wale sign-in par le jayenge; allow karo).
2. Wapas aakar **chart-of-accounts mapping** set karo (10 lines → aapke accounts), **Save accounts**.
3. (Optional) "Post automatically when payroll is approved" / "Post as draft" / "second person check" set karo.
4. Payroll → ek approved run kholo → **Accounting** tab → journal dekho → **Post** (ya send for check).
5. Provider me jaa kar journal confirm karo. Draft providers me pehle draft check karo.

## Troubleshooting

- **"redirect address" error:** app me daali redirect URI UI wali se bilkul same honi chahiye (https, no trailing slash/space).
- **"app keys missing":** UI me keys daalo ya `.env` me provider ke `_CLIENT_ID`/`_CLIENT_SECRET`.
- **"Choose accounts for: …":** mapping adhoori hai — un lines ke accounts chuno.
- **"does not balance":** payroll lines check karo (debit≠credit).
- **Two-person check:** sirf 1 admin ho to doosra admin add karo (Settings → Team) ya review off kar do.
