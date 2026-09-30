import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-gray-200 bg-brand-navy-dark text-brand-gray-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold text-white">{SITE_NAME}</p>
        <p className="mt-2 max-w-md text-sm text-brand-gray-300">
          {SITE_TAGLINE}. Resistencia, Chaco.
        </p>
        <p className="mt-6 text-xs text-brand-gray-500">
          © {new Date().getFullYear()} {SITE_NAME}. Sitio de demostración.
        </p>
      </div>
    </footer>
  );
}
