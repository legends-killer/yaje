/*
 * @Author: legends-killer
 * @Date: 2023-12-27 21:58:54
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-24 23:03:33
 * @Description:
 */

import { languages as Languages } from 'monaco-editor'

export interface ISuggestionItem {
  title: string
  suggestion: string
  kind: Languages.CompletionItemKind
  description?: string
  sortText?: string
}

export class JsonSchemaProcessor {
  schema: any
  constructor(schema: any) {
    this.schema = schema
  }
  private getSchemaByRef(ref: string) {
    const refPath = ref.split('/')
    const refName = refPath[refPath.length - 1]
    return this.schema.definitions[refName] ?? {}
  }
  private deRef(currentDefinition: any) {
    const properties = currentDefinition.properties
    const res = {} as any
    if (!properties) return res
    Object.entries(properties).forEach((prop: any) => {
      const [key, value] = prop
      if (value.$ref?.length) {
        res[key] = this.deRef(this.getSchemaByRef(value.$ref))
      } else {
        res[key] = value
      }
    })
    return { ...currentDefinition, properties: res }
  }

  private getSuggestionItemFromDeRefedDefinition(definition: any) {
    let res = ''
    if (definition.type === 'object') {
      const properties = definition.properties
      if (!properties) return '{}'
      Object.entries(properties).forEach((prop: any, idx: number) => {
        const [key, value] = prop
        res += `"${key}": ${this.getSuggestionItemFromDeRefedDefinition(value)}`
        if (idx !== Object.keys(properties).length - 1) {
          res += ',\n'
        }
      })
      return `{\n${res}\n}`
    }
    if (definition.type === 'array') {
      const items = definition.items
      if (!items) return res
      res += `${this.getSuggestionItemFromDeRefedDefinition(items)}`
      return `[${res}]`
    }
    if (definition.type === 'number') {
      return `0`
    }
    if (definition.type === 'boolean') {
      return `true`
    }

    return '""'
  }

  private getSuggestionItemFromDerefDefinitionKey(definition: any) {
    const res: ISuggestionItem[] = []
    if (definition.type === 'object') {
      const properties = definition.properties
      if (!properties) return []
      Object.entries(properties).forEach((prop: any) => {
        const [key, value] = prop
        res.push({
          title: key,
          suggestion: `"${key}"`,
          kind: Languages.CompletionItemKind.Variable,
          description: value.description ?? '',
        })
      })
      return res
    }
    return res
  }

  private uniqueArray(arr: ISuggestionItem[]): ISuggestionItem[] {
    const uniqueSet = new Set(arr.map((item) => JSON.stringify(item)))
    const uniqueArray = Array.from(uniqueSet).map((item) => JSON.parse(item) as ISuggestionItem)
    return uniqueArray
  }

  getSuggestions() {
    let keySuggestions: ISuggestionItem[] = []
    let valueSuggestions: ISuggestionItem[] = []
    try {
      const definitions = { ...this.schema.definitions, ...this.schema.properties }
      for (const [key, val] of Object.entries<any>(definitions)) {
        if (val.type === 'object') {
          const deRefedDefinition = this.deRef(val)

          valueSuggestions.push({
            title: key,
            suggestion: this.getSuggestionItemFromDeRefedDefinition(deRefedDefinition),
            kind: Languages.CompletionItemKind.Struct,
            sortText: key,
          })
          keySuggestions.push({
            title: key,
            suggestion: `"${key}"`,
            kind: Languages.CompletionItemKind.Variable,
            description: val.description ?? '',
            sortText: key,
          })
          keySuggestions = keySuggestions.concat(this.getSuggestionItemFromDerefDefinitionKey(deRefedDefinition))
        } else {
          valueSuggestions.push({
            title: key,
            kind: Languages.CompletionItemKind.Text,
            suggestion: '""',
            sortText: key,
          })
          keySuggestions.push({
            title: key,
            kind: Languages.CompletionItemKind.Variable,
            suggestion: `"${key}"`,
            sortText: key,
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
    keySuggestions = this.uniqueArray(keySuggestions)
    valueSuggestions = this.uniqueArray(valueSuggestions)
    return { keySuggestions, valueSuggestions }
  }
}
