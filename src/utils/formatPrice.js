export default function FormatPrice(number) {
    return new Intl.NumberFormat('de-DE').format(number)
}