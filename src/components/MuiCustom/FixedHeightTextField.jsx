import React from 'react'
import { TextField } from '@mui/material'
import { styled } from '@mui/system'

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiFormHelperText-root': {
        marginTop: theme.spacing(0.1),
        height: '1.5em',
        '&.Mui-error': {
            marginBottom: 0,
        },
        color: 'red'
    },
}))

export default function FixedHeightTextField(props) {
    const { helperText, ...otherProps } = props

    return (
        <StyledTextField
            {...otherProps}
            helperText={helperText || ' '}
        />
    )
}