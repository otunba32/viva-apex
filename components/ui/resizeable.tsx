'use client'

import * as React from 'react'
import { GripVertical } from 'lucide-react'

import { cn } from '@/lib/utils'

function ResizablePanelGroup({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="resizable-panel-group"
      className={cn('flex h-full w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizablePanel({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="resizable-panel"
      className={cn('flex-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  withHandle?: boolean
}) {
  return (
    <div
      data-slot="resizable-handle"
      className={cn(
        'bg-border relative flex w-px items-center justify-center',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </div>
  )
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
}