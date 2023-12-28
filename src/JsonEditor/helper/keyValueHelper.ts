/*
 * @Author: legends-killer
 * @Date: 2023-12-27 21:30:23
 * @LastEditors: legends-killer
 * @LastEditTime: 2023-12-28 16:25:47
 * @Description:
 */

import { IPosition } from 'monaco-editor'

export enum JSON_FIELD_TYPE {
  'KEY' = 'KEY',
  'VALUE' = 'VALUE',
}

const checkSpliterByLine = (currentLine: string) => {
  const colonIndex = { type: 'colon', idx: currentLine.lastIndexOf(':') }
  const leftBraceIndex = { type: 'leftBrace', idx: currentLine.lastIndexOf('{') }
  const commaIndex = { type: 'comma', idx: currentLine.lastIndexOf(',') }
  const firstSpliter = [colonIndex, leftBraceIndex, commaIndex].sort((a, b) => a.idx - b.idx).pop()
  // console.log('firstSpliter', firstSpliter)
  if (!firstSpliter || firstSpliter.idx === -1) return JSON_FIELD_TYPE.KEY
  switch (firstSpliter.type) {
    case 'colon':
      return JSON_FIELD_TYPE.VALUE
    case 'leftBrace':
    case 'comma':
      return JSON_FIELD_TYPE.KEY
    default:
      return null
  }
}

/**
 * @returns {JSON_FIELD_TYPE} KEY VALUE
 */
export const getCurrentCursorType: (ctx: string, position: IPosition) => JSON_FIELD_TYPE = (ctx, position) => {
  const lines = ctx.split('\n')
  let curLineNum = position.lineNumber - 1
  const curColNum = position.column - 1
  const currentLine = lines[curLineNum].slice(0, curColNum)
  const currentLineResult = checkSpliterByLine(currentLine)
  if (currentLineResult) return currentLineResult

  while (curLineNum > 1) {
    const prevLine = lines[curLineNum - 1]
    const prevLineResult = checkSpliterByLine(prevLine)
    if (prevLineResult) return prevLineResult
    curLineNum--
  }
  return JSON_FIELD_TYPE.KEY
}
