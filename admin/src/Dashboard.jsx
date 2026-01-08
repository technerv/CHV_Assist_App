import { Card, CardContent, Typography, Grid } from '@mui/material'
import { useEffect, useState } from 'react'

const Dashboard = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:8001/api/supervisor/summary', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])
  const Item = ({ label, value }) => (
    <Card><CardContent><Typography variant="subtitle2">{label}</Typography><Typography variant="h5">{value ?? '-'}</Typography></CardContent></Card>
  )
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={12} md={4}><Item label="Visits (24h)" value={data?.visits_24h} /></Grid>
      <Grid item xs={12} md={4}><Item label="Pregnancies" value={data?.pregnancies_total} /></Grid>
      <Grid item xs={12} md={4}><Item label="Referrals Pending" value={data?.referrals_pending} /></Grid>
      <Grid item xs={12} md={4}><Item label="Referrals Urgent" value={data?.referrals_urgent} /></Grid>
      <Grid item xs={12} md={4}><Item label="Emergencies (24h)" value={data?.emergencies_flagged_24h} /></Grid>
      <Grid item xs={12} md={4}><Item label="Reminders Scheduled" value={data?.reminders_scheduled} /></Grid>
    </Grid>
  )
}

export default Dashboard
