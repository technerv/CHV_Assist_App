import { List, Datagrid, TextField, DateField, SelectInput, TextInput as RATextInput, TopToolbar, ExportButton } from 'react-admin'

const MessageLogFilters = [
  <SelectInput source="channel" choices={[
    { id: 'ussd', name: 'ussd' },
    { id: 'whatsapp', name: 'whatsapp' },
    { id: 'sms', name: 'sms' },
    { id: 'voice', name: 'voice' },
    { id: 'app', name: 'app' },
  ]} alwaysOn />,
  <SelectInput source="direction" choices={[
    { id: 'in', name: 'in' },
    { id: 'out', name: 'out' },
  ]} alwaysOn />,
  <RATextInput source="phone" alwaysOn />,
]

const MessageLogActions = () => (
  <TopToolbar>
    <ExportButton />
  </TopToolbar>
)

export const MessageLogList = () => (
  <List filters={MessageLogFilters} actions={<MessageLogActions />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="channel" />
      <TextField source="direction" />
      <TextField source="phone" />
      <TextField source="content" />
      <DateField source="timestamp" />
      <TextField source="correlation_id" />
    </Datagrid>
  </List>
)
