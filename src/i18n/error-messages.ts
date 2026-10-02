import type { Locale } from "./config";

/** Shared with the client-side error boundary, which cannot load server dictionaries. */
export const errorMessages: Record<Locale, { title: string; body: string; retry: string }> = {
  en: { title: "Something failed to load.", body: "An unexpected error interrupted this page. You can try again.", retry: "Try again" },
  tr: { title: "Bir şey yüklenemedi.", body: "Beklenmeyen bir hata bu sayfayı yarıda kesti. Yeniden deneyebilirsiniz.", retry: "Yeniden dene" },
  de: { title: "Etwas konnte nicht geladen werden.", body: "Ein unerwarteter Fehler hat diese Seite unterbrochen. Sie können es erneut versuchen.", retry: "Erneut versuchen" },
  fr: { title: "Un élément n’a pas pu être chargé.", body: "Une erreur inattendue a interrompu cette page. Vous pouvez réessayer.", retry: "Réessayer" },
  es: { title: "Algo no se pudo cargar.", body: "Un error inesperado interrumpió esta página. Puedes intentarlo de nuevo.", retry: "Reintentar" },
  pt: { title: "Algo não pôde ser carregado.", body: "Um erro inesperado interrompeu esta página. Você pode tentar novamente.", retry: "Tentar novamente" },
  it: { title: "Non è stato possibile caricare un contenuto.", body: "Un errore imprevisto ha interrotto questa pagina. Puoi riprovare.", retry: "Riprova" },
  ar: { title: "تعذّر تحميل جزء من الصفحة.", body: "قاطع خطأ غير متوقع هذه الصفحة. يمكنك المحاولة مرة أخرى.", retry: "إعادة المحاولة" },
  ja: { title: "読み込みに失敗しました。", body: "予期しないエラーによりこのページの表示が中断されました。もう一度お試しください。", retry: "再試行" },
  ko: { title: "일부 내용을 불러오지 못했습니다.", body: "예기치 않은 오류로 이 페이지가 중단되었습니다. 다시 시도해 주세요.", retry: "다시 시도" },
};
