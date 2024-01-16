/*
 * @Author: legends-killer
 * @Date: 2024-01-15 21:02:24
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-16 20:44:58
 * @Description: 
 */
import { ISuggestionItem } from "./helper/jsonSchemaProcessor";
export const filterRepeateSuggestions = (suggestions: ISuggestionItem[]) => {
  const suggestionsMap = new Map<string, ISuggestionItem>()
  suggestions.forEach((suggestion) => {
    suggestionsMap.set(suggestion.title, suggestion)
  })
  return Array.from(suggestionsMap.values())
}