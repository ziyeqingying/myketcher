import React from 'react'
//@ts-ignore
import Miew from 'miew'
import 'miew/dist/Miew.min.css'
//@ts-ignore
import { Editor, RemoteStructServiceProvider } from 'ketcher-react'
import 'ketcher-react/dist/index.css'
//import { StandaloneStructService } from 'ketcher-standalone'
;(global as any).Miew = Miew

let structServiceProvider: any = new RemoteStructServiceProvider()
console.log(process.env)
if (process.env.MODE === 'standalone') {
  const { StandaloneStructServiceProvider } = require('ketcher-standalone')
  structServiceProvider = new StandaloneStructServiceProvider()
}

const App = () => {
  return (
    <div>
      <Editor
        staticResourcesUrl={process.env.PUBLIC_URL}
        apiPath={process.env.REACT_APP_API_PATH}
        //@ts-ignore
        structServiceProvider={structServiceProvider}
      />
    </div>
  )
}

export default App
