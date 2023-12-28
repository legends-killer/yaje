/*
 * @Author: legends-killer
 * @Date: 2023-12-28 16:59:34
 * @LastEditors: legends-killer
 * @LastEditTime: 2023-12-28 17:00:01
 * @Description: 
 */
import { Monaco } from '@monaco-editor/react'
import { ISuggestionItem } from '../helper/jsonSchemaProcessor'

export interface IProviderParam {
  monaco: Monaco
  jsonKeySuggestions: ISuggestionItem[]
  jsonValueSuggestions: ISuggestionItem[]
  triggerCharacters?: string[]
  onSuggestionItemSelect?: (item: ISuggestionItem) => void
}
