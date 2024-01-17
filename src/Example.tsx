/*
 * @Author: legends-killer
 * @Date: 2023-12-27 20:10:41
 * @LastEditors: legends-killer
 * @LastEditTime: 2024-01-17 22:50:48
 * @Description: Example App
 */
import { useEffect, useRef, useState } from 'react'
import { JsonEditor } from './JsonEditor'
import { languages as Languages } from 'monaco-editor'
import { ISuggestionItem } from './JsonEditor/helper/jsonSchemaProcessor'

export const Example = () => {
  const [jsonSchema, setJsonSchema] = useState()
  const [loading, setLoading] = useState(true)
  const [valueSuggestions, setValueSuggestions] = useState<ISuggestionItem[]>([])
  const ref = useRef<any>()
  // to fix the issue that monaco editor will add repeated suggestions
  // maintain the suggestions that have been added in a outter component by user
  const addedKeySuggestions = useRef<ISuggestionItem[]>([])
  const addedValueSuggestions = useRef<ISuggestionItem[]>([])

  const init = async () => {
    const jsonSchema = await (
      await fetch('https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json')
    ).json()

    const myValueSuggestions: ISuggestionItem[] = []
    Object.entries(jsonSchema.definitions).forEach((entity) => {
      const [key, _] = entity
      myValueSuggestions.push({
        title: `@${key}`,
        suggestion: `"@${key}"`,
        kind: Languages.CompletionItemKind.Reference,
      })
    })
    setValueSuggestions(myValueSuggestions)
    addedValueSuggestions.current = addedValueSuggestions.current.concat(myValueSuggestions)
    setJsonSchema(jsonSchema)
    setLoading(false)
  }

  useEffect(() => {
    init()
  }, [])

  const getEditorValue = () => {
    return ref.current?.getEditorValue()
  }

  return (
    <div>
      {!loading && (
        <JsonEditor
          addedKeySuggestions={addedKeySuggestions}
          addedValueSuggestions={addedValueSuggestions}
          ref={ref}
          keySuggesions={[]}
          valueSuggestions={valueSuggestions}
          height={'90vh'}
          promptJsonSchema={jsonSchema}
          userDefinedItemCompleteProviders={[]}
          triggerCharacters={['{']}
        />
      )}
      <button
        onClick={() => {
          console.log(getEditorValue())
        }}
      >
        getValue
      </button>
    </div>
  )
}
