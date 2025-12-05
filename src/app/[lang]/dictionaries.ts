import 'server-only'

const dictionaries = {
    ['en-US']: () => import('../../constants/dictionaries/en-US.json').then((module) => module.default),
    ['vi-VN']: () => import('../../constants/dictionaries/vi-VN.json').then((module) => module.default),
}

export type TDictionaryKeys = keyof typeof dictionaries

export const getDictionary = async (locale: TDictionaryKeys) =>
    dictionaries[locale]()

export type TReturnOfGetDictionary = Awaited<ReturnType<typeof getDictionary>>