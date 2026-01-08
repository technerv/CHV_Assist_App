import { Admin, Resource } from 'react-admin'
import dataProvider from './dataProvider'
import authProvider from './authProvider'
import { FacilityList, FacilityEdit } from './resources/Facilities.jsx'
import { HouseholdList, HouseholdEdit } from './resources/Households.jsx'
import { MemberList, MemberEdit } from './resources/Members.jsx'
import { ReferralList, ReferralEdit } from './resources/Referrals.jsx'
import { RuleList, RuleEdit } from './resources/Rules.jsx'
import { MessageLogList } from './resources/MessageLogs.jsx'
import Dashboard from './Dashboard.jsx'

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider} dashboard={Dashboard}>
      <Resource name="facilities" list={FacilityList} edit={FacilityEdit} />
      <Resource name="households" list={HouseholdList} edit={HouseholdEdit} />
      <Resource name="members" list={MemberList} edit={MemberEdit} />
      <Resource name="referrals" list={ReferralList} edit={ReferralEdit} />
      <Resource name="rules" list={RuleList} edit={RuleEdit} />
      <Resource name="message-logs" list={MessageLogList} />
    </Admin>
  )
}

export default App
