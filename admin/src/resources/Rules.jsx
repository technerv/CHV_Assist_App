import { List, Datagrid, TextField, Edit, SimpleForm, TextInput, SelectInput, useInput } from 'react-admin'

const JSONInput = ({ source }) => {
  const { field } = useInput({ source })
  const value = typeof field.value === 'string' ? field.value : JSON.stringify(field.value || {}, null, 2)
  const onChange = e => field.onChange(e.target.value)
  const onBlur = e => {
    try {
      const parsed = JSON.parse(e.target.value || '{}')
      field.onChange(parsed)
    } catch (err) {
      field.onChange(e.target.value)
    }
  }
  return <textarea rows={8} value={value} onChange={onChange} onBlur={onBlur} style={{ width: '100%' }} />
}

export const RuleList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="scope" />
      <TextField source="enabled" />
    </Datagrid>
  </List>
)

export const RuleEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <SelectInput source="scope" choices={[
        { id: 'visit', name: 'visit' },
        { id: 'pregnancy', name: 'pregnancy' },
        { id: 'referral', name: 'referral' },
      ]} />
      <JSONInput source="condition_json" />
      <JSONInput source="actions_json" />
      <SelectInput source="enabled" choices={[
        { id: true, name: 'true' },
        { id: false, name: 'false' },
      ]} />
    </SimpleForm>
  </Edit>
)
