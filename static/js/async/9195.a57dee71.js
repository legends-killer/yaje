/*! For license information please see 9195.a57dee71.js.LICENSE.txt */
(self.webpackChunkyaje=self.webpackChunkyaje||[]).push([["9195"],{4902:function(e,t,n){"use strict";n.r(t),n.d(t,{conf:function(){return s},language:function(){return p}});var a,o,i=n("6586"),r=Object.defineProperty,c=Object.getOwnPropertyDescriptor,l=Object.getOwnPropertyNames,m=Object.prototype.hasOwnProperty,u=(e,t,n,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let o of l(t))!m.call(e,o)&&o!==n&&r(e,o,{get:()=>t[o],enumerable:!(a=c(t,o))||a.enumerable});return e},d={};u(d,a=i,"default"),o&&u(o,a,"default");var s={comments:{blockComment:["\x3c!--","-->"]},brackets:[["<",">"]],autoClosingPairs:[{open:"<",close:">"},{open:"'",close:"'"},{open:'"',close:'"'}],surroundingPairs:[{open:"<",close:">"},{open:"'",close:"'"},{open:'"',close:'"'}],onEnterRules:[{beforeText:RegExp("<([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$","i"),afterText:/^<\/([_:\w][_:\w-.\d]*)\s*>$/i,action:{indentAction:d.languages.IndentAction.IndentOutdent}},{beforeText:RegExp("<(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$","i"),action:{indentAction:d.languages.IndentAction.Indent}}]},p={defaultToken:"",tokenPostfix:".xml",ignoreCase:!0,qualifiedName:/(?:[\w\.\-]+:)?[\w\.\-]+/,tokenizer:{root:[[/[^<&]+/,""],{include:"@whitespace"},[/(<)(@qualifiedName)/,[{token:"delimiter"},{token:"tag",next:"@tag"}]],[/(<\/)(@qualifiedName)(\s*)(>)/,[{token:"delimiter"},{token:"tag"},"",{token:"delimiter"}]],[/(<\?)(@qualifiedName)/,[{token:"delimiter"},{token:"metatag",next:"@tag"}]],[/(<\!)(@qualifiedName)/,[{token:"delimiter"},{token:"metatag",next:"@tag"}]],[/<\!\[CDATA\[/,{token:"delimiter.cdata",next:"@cdata"}],[/&\w+;/,"string.escape"]],cdata:[[/[^\]]+/,""],[/\]\]>/,{token:"delimiter.cdata",next:"@pop"}],[/\]/,""]],tag:[[/[ \t\r\n]+/,""],[/(@qualifiedName)(\s*=\s*)("[^"]*"|'[^']*')/,["attribute.name","","attribute.value"]],[/(@qualifiedName)(\s*=\s*)("[^">?\/]*|'[^'>?\/]*)(?=[\?\/]\>)/,["attribute.name","","attribute.value"]],[/(@qualifiedName)(\s*=\s*)("[^">]*|'[^'>]*)/,["attribute.name","","attribute.value"]],[/@qualifiedName/,"attribute.name"],[/\?>/,{token:"delimiter",next:"@pop"}],[/(\/)(>)/,[{token:"tag"},{token:"delimiter",next:"@pop"}]],[/>/,{token:"delimiter",next:"@pop"}]],whitespace:[[/[ \t\r\n]+/,""],[/<!--/,{token:"comment",next:"@comment"}]],comment:[[/[^<\-]+/,"comment.content"],[/-->/,{token:"comment",next:"@pop"}],[/<!--/,"comment.content.invalid"],[/[<\-]/,"comment.content"]]}}}}]);