import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import type { CatalogOption } from '@/services/profileService'
import type { ResourceInput } from '@/services/resourceService'

interface ResourceFormProps {
  colleges: CatalogOption[]
  branches: CatalogOption[]
  semesters: CatalogOption[]
  subjects: CatalogOption[]
  submitting: boolean
  onSubmit: (input: ResourceInput) => Promise<void>
}

export function ResourceForm({
  colleges,
  branches,
  semesters,
  subjects,
  submitting,
  onSubmit,
}: ResourceFormProps) {
  const [values, setValues] = useState<ResourceInput>({
    title: '',
    description: '',
    resourceType: 'notes',
    collegeId: '',
    branchId: '',
    semesterId: '',
    subjectId: '',
    googleDriveUrl: '',
    coverImageUrl: '',
  })
  const [error, setError] = useState<string | null>(null)
  const filteredBranches = useMemo(
    () => branches.filter((branch) => !values.collegeId || branch.college_id === values.collegeId),
    [branches, values.collegeId],
  )
  const filteredSubjects = useMemo(
    () => subjects.filter((subject) =>
      (!values.collegeId || subject.college_id === values.collegeId) &&
      (!values.branchId || subject.branch_id === values.branchId) &&
      (!values.semesterId || subject.semester_id === values.semesterId),
    ),
    [subjects, values.branchId, values.collegeId, values.semesterId],
  )

  function update(key: keyof ResourceInput, value: string) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!values.title.trim() || !values.collegeId || !values.branchId || !values.semesterId || !values.subjectId) {
      setError('Complete the title and all academic fields before submitting.')
      return
    }
    try {
      await onSubmit(values)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit resource.')
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Input label="Resource title" value={values.title} onChange={(event) => update('title', event.target.value)} required />
      <Textarea label="Description" value={values.description} onChange={(event) => update('description', event.target.value)} rows={4} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Resource type" value={values.resourceType} onChange={(value) => update('resourceType', value)} options={resourceTypes} />
        <Select label="College" value={values.collegeId} onChange={(value) => update('collegeId', value)} options={colleges.map((item) => ({ value: item.id, label: item.name ?? '' }))} />
        <Select label="Branch" value={values.branchId} onChange={(value) => update('branchId', value)} options={filteredBranches.map((item) => ({ value: item.id, label: item.name ?? '' }))} />
        <Select label="Semester" value={values.semesterId} onChange={(value) => update('semesterId', value)} options={semesters.map((item) => ({ value: item.id, label: item.label ?? '' }))} />
        <Select label="Subject" value={values.subjectId} onChange={(value) => update('subjectId', value)} options={filteredSubjects.map((item) => ({ value: item.id, label: item.name ?? '' }))} />
      </div>
      <Input
        label="Google Drive or Docs link"
        type="url"
        placeholder="https://drive.google.com/..."
        value={values.googleDriveUrl}
        onChange={(event) => update('googleDriveUrl', event.target.value)}
        hint="Set sharing to anyone with the link before submitting."
        required
      />
      <Input label="Cover image URL (optional)" type="url" value={values.coverImageUrl} onChange={(event) => update('coverImageUrl', event.target.value)} />
      {error && <p className="text-sm text-sky" role="alert">{error}</p>}
      <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for review'}</Button>
    </form>
  )
}

const resourceTypes = [
  { value: 'notes', label: 'Notes' },
  { value: 'books', label: 'Books' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'previous-year-papers', label: 'Previous Year Papers' },
  { value: 'question-banks', label: 'Question Banks' },
  { value: 'lab-manuals', label: 'Lab Manuals' },
  { value: 'ppts', label: 'PPTs' },
  { value: 'important-questions', label: 'Important Questions' },
  { value: 'study-material', label: 'Study Material' },
  { value: 'other', label: 'Other' },
]

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-paper">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 rounded-control border border-white/12 bg-white/4 px-3.5 text-sm text-paper focus:border-sky/70 focus:outline-none">
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
