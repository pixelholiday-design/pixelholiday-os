import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const SUPPORTED_LOCALES = ["en", "de", "fr", "th", "ru", "zh"];

export default getRequestConfig(async () => {
  // Priority: 1. cookie, 2. Accept-Language header, 3. default "en"
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("locale")?.value;

  let locale = "en";

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    locale = cookieLocale;
  } else {
    const acceptLang = headers().get("accept-language") ?? "";
    const preferred  = acceptLang.split(",")[0]?.split("-")[0]?.toLowerCase() ?? "en";
    locale = SUPPORTED_LOCALES.includes(preferred) ? preferred : "en";
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
