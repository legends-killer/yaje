/*
 * @Author: legends-killer
 * @Date: 2023-12-27 20:10:41
 * @LastEditors: legends-killer
 * @LastEditTime: 2023-12-28 22:30:36
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
          ref={ref}
          keySuggesions={[]}
          valueSuggestions={valueSuggestions}
          height={'90vh'}
          promptJsonSchema={jsonSchema}
          userDefinedItemCompleteProviders={[]}
          triggerCharacters={["{"]}
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
