export const validatePhoneNumber = (str) => {
    const re = RegExp('^([3|5|7|8|9])[0-9]{8}\\b')
    return re.test(str)
}

export const validateOTP = (str) => {
    const re = RegExp('[0-9]{6}\\b')
    return re.test(str)
}