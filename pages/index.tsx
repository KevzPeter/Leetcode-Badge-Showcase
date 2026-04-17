import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'
import { THEME_NAMES, BORDER } from '../utils/config'
import { Analytics } from "@vercel/analytics/next";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const themes = THEME_NAMES;
  const filters = [
    { name: 'All', value: '' },
    { name: 'Daily Badges', value: 'daily' },
    { name: 'Study Badges', value: 'study' },
    { name: 'Competition Badges', value: 'comp' },
    { name: 'Annual Badges', value: 'annual' },
    { name: 'Submission Badges', value: 'submission' }
  ]
  const borders = BORDER;

  const defaultTheme = themes[0] ?? 'light'
  const defaultBorder = borders[0] ?? 'border'

  const [form, setForm] = useState({
    username: '',
    theme: defaultTheme,
    filter: '',
    limit: '',
    animated: 'false',
    anon: 'false',
    border: defaultBorder,
  })

  const canSubmit = useMemo(() => form.username.trim().length > 0 && !loading, [form.username, loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const username = form.username.trim()
    if (!username) return

    setLoading(true)
    const params = new URLSearchParams({ username })

    if (form.theme) params.set('theme', form.theme)
    if (form.filter) params.set('filter', form.filter)
    if (form.border) params.set('border', form.border)
    if (form.animated) params.set('animated', form.animated)
    if (form.anon === 'true') params.set('anon', 'true')

    const limitValue = String(form.limit ?? '').trim()
    if (limitValue) params.set('limit', limitValue)

    router
      .push(`/api?${params.toString()}`)
      .then(() => setLoading(false))
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }
  return (
    <>
      <Head>
        <title>Leetcode Badge Showcase</title>
        <meta name="description" content="Showcase your Leetcode badges on your Github readme page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ py: { xs: 4, sm: 8 } }}>
        <Container maxWidth="sm">
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                LeetCode Badge Showcase
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Flaunt your hard-earned LeetCode Badges in this personalized showcase!
              </Typography>
            </Stack>

            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    label="Username"
                    placeholder="your-leetcode-username"
                    value={form.username}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    autoComplete="off"
                    fullWidth
                    required
                  />

                  <FormControl fullWidth>
                    <InputLabel id="theme-label">Theme</InputLabel>
                    <Select
                      labelId="theme-label"
                      label="Theme"
                      value={form.theme}
                      onChange={(e) => setForm((prev) => ({ ...prev, theme: String(e.target.value) }))}
                    >
                      {themes.map((theme, index) => (
                        <MenuItem key={index} value={theme}>
                          {theme}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="filter-label">Filter</InputLabel>
                    <Select
                      labelId="filter-label"
                      label="Filter"
                      value={form.filter}
                      onChange={(e) => setForm((prev) => ({ ...prev, filter: String(e.target.value) }))}
                    >
                      {filters.map((filter, index) => (
                        <MenuItem key={index} value={filter.value}>
                          {filter.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Latest badges"
                    placeholder="e.g. 10"
                    type="number"
                    slotProps={{ htmlInput: { min: 1 } }}
                    helperText="Optional. Limits the total badges shown to the latest X earned."
                    value={form.limit}
                    onChange={(e) => setForm((prev) => ({ ...prev, limit: e.target.value }))}
                    fullWidth
                  />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id="animated-label">Animated</InputLabel>
                      <Select
                        labelId="animated-label"
                        label="Animated"
                        value={form.animated}
                        onChange={(e) => setForm((prev) => ({ ...prev, animated: String(e.target.value) }))}
                      >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel id="anon-label">Hide username</InputLabel>
                      <Select
                        labelId="anon-label"
                        label="Hide username"
                        value={form.anon}
                        onChange={(e) => setForm((prev) => ({ ...prev, anon: String(e.target.value) }))}
                      >
                        <MenuItem value="false">No</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>

                  <FormControl fullWidth>
                    <InputLabel id="border-label">Border</InputLabel>
                    <Select
                      labelId="border-label"
                      label="Border"
                      value={form.border}
                      onChange={(e) => setForm((prev) => ({ ...prev, border: String(e.target.value) }))}
                    >
                      <MenuItem value="border">Yes</MenuItem>
                      <MenuItem value="no-border">No</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!canSubmit}
                    sx={{ py: 1.25, borderRadius: 2 }}
                  >
                    {loading ? (
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <CircularProgress size={18} color="inherit" />
                        <span>Generating…</span>
                      </Stack>
                    ) : (
                      'Get Badges'
                    )}
                  </Button>
                </Stack>
              </Box>
            </Paper>

            <Typography variant="body2" color="text.secondary">
              More info on the{' '}
              <Link href="https://github.com/KevzPeter/Leetcode-Badge-Showcase" target="_blank" rel="noreferrer">
                GitHub page
              </Link>
              .
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Analytics />
    </>
  )
}

export default Home
