import React, { FC } from 'react'

export interface WelcomeProps {
    msg: string
}

export const Welcome: FC<WelcomeProps> = (props) => {
    const { msg } = props
    return <h1>{msg}</h1>
}