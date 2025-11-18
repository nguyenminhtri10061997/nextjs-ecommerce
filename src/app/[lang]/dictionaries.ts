import 'server-only'

const dictionaries = {
    ['en-US']: () => import('../../constants/dictionaries/en-US.json').then((module) => module.default),
    ['vi-VN']: () => import('../../constants/dictionaries/vi-VN.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en-US' | 'vi-VN') =>
    dictionaries[locale]()

export type TReturnOfGetDictionary = Awaited<ReturnType<typeof getDictionary>>

export type TLang = 'en-US' | 'vi-VN'