import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusBadge } from './status-badge'

const meta = {
  title: 'devices/StatusBadge',
  component: StatusBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['online', 'warning', 'offline'] },
  },
} satisfies Meta<typeof StatusBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Online: Story = { args: { status: 'online' } }
export const Warning: Story = { args: { status: 'warning' } }
export const Offline: Story = { args: { status: 'offline' } }
