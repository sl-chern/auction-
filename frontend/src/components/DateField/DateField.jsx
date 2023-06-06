import React, { useRef } from 'react'
import { useDateFieldState } from '@react-stately/datepicker'
import { useDateField } from '@react-aria/datepicker'
import { createCalendar } from '@internationalized/date'
import { DateSegment } from '../DateSegment/DateSegment'
import classNames from 'classnames'

export function DateField(props) {
  let locale = 'uk-UK'
  
  let state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
    hideTimeZone: true
  })

  let ref = useRef()
  let { labelProps, fieldProps } = useDateField(props, state, ref)

  return (
    <div className={`flex flex-col items-start w-full ${props.className || ''}`}>
      <span {...labelProps} className={classNames('text-lg leading-[1.7rem] font-openSans', !!props.errorMessage ? 'text-red-600' : 'default-text')}>
        {props.label}
      </span>
      <div
        {...fieldProps}
        ref={ref}
        className={classNames('flex w-full bg-transparent border transition-colors rounded p-2', !!props.errorMessage ? 'border-red-600' : 'border-dark-200 dark:border-light-300')}
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} errorMessage={props.errorMessage}/>
        ))}
      </div>
    </div>
  )
}