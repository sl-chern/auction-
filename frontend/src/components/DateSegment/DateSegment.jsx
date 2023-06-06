import React, { useRef } from 'react'
import { useDateSegment } from '@react-aria/datepicker'
import classNames from 'classnames'

export function DateSegment({ segment, state, errorMessage }) {
  let ref = useRef()
  let { segmentProps } = useDateSegment(segment, state, ref)

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null && String(segment.maxValue).length + 'ch'
      }}
      className={
        classNames(
          `px-[2px] box-content tabular-nums text-right outline-none rounded-sm focus:bg-dark-200 focus:dark:bg-light-300 focus:text-light-300 focus:dark:text-dark-200 group`, 
          !segment.isEditable ? 'text-dark-400 dark:text-light-400' : 'text-dark-500 dark:text-light-500',
        )
      }
    >
      <span
        aria-hidden='true'
        className={
          classNames(
            `block w-full text-center italic `,
            !!errorMessage ? 'text-red-600' : 'text-dark-200 dark:text-light-300 group-focus:text-light-300 group-focus:dark:text-dark-200'
          )
        }
        style={{
          visibility: segment.isPlaceholder ? '' : 'hidden',
          height: segment.isPlaceholder ? '' : 0,
          pointerEvents: 'none'
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  );
}
