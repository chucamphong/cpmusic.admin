export default function numberFormat(value: number, locale?: string | string[], options?: Intl.NumberFormatOptions): string {
    return Intl.NumberFormat(locale, options).format(value);
}

