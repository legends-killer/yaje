/*
 * @Author: legends-killer
 * @Date: 2024-01-15 21:02:24
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-17 22:47:24
 * @Description:
 */
import { ISuggestionItem } from './helper/jsonSchemaProcessor'
const suggestionDeepEqual = (obj1: ISuggestionItem, obj2: ISuggestionItem) => {
  return obj1.title === obj2.title && obj1.suggestion === obj2.suggestion && obj1.kind === obj2.kind
}
export const filterRepeateSuggestions = (suggestions: ISuggestionItem[], addedSuggestions?: ISuggestionItem[]) => {
  const suggestionsMap = new Map<string, ISuggestionItem>()
  suggestions.forEach((suggestion) => {
    if (addedSuggestions && !addedSuggestions.find((f) => suggestionDeepEqual(f, suggestion)))
      suggestionsMap.set(suggestion.title, suggestion)
  })
  return Array.from(suggestionsMap.values())
}
