import React from "react";
import { Welcome } from '@bb/components'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('app') as HTMLElement)

root.render(<Welcome msg="???" />)