import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import {
  COLORS, STAGES, VISIT_OUTCOMES, fmtDateTime, minutesDiff, nowISO, Stage,
} from '@/constants/theme';
import { Card, CardTitle, Btn, Avatar, Divider, InfoRow } from '@/components/UI';

export default function LeadDetailModal() {
  const { leadId } = useLocalSearchParams<{ leadId: string }>();
  const router     = useRouter();
  const { state, dispatch } = useAppStore();

  const lead      = state.leads.find(l => l.id === leadId);
  const agent     = state.agents.find(a => a.id === lead?.agentId);
  const property  = state.properties.find(p => p.id === lead?.visitProperty);

  const [stage,         setStage]         = useState(lead?.stage ?? 'New Lead');
  const [agentId,       setAgentId]       = useState(lead?.agentId ?? '');
  const [visitProperty, setVisitProperty] = useState(lead?.visitProperty ?? '');
  const [visitOutcome,  setVisitOutcome]  = useState(lead?.visitOutcome ?? '');
  const [noteText,      setNoteText]      = useState('');

  if (!lead) return null;

  const responseMins = lead.firstResponseAt
    ? minutesDiff(lead.createdAt, lead.firstResponseAt) : null;

  const save = () => {
    const updates: any = { stage, agentId, visitProperty: visitProperty || null, visitOutcome: visitOutcome || null };
    if (stage !== 'New Lead' && !lead.firstResponseAt) updates.firstResponseAt = nowISO();
    dispatch({ type: 'UPDATE_LEAD', payload: { id: lead.id, updates } });
    router.back();
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    dispatch({ type: 'ADD_NOTE', payload: { id: lead.id, text: noteText.trim() } });
    setNoteText('');
  };

  const ChipRow = ({ label, value, options, onSelect, color }: {
    label: string; value: string; options: readonly string[] | string[];
    onSelect: (v: string) => void; color?: string;
  }) => (
    <View style={{ marginBottom: 16 }}>
      {label ? <Text style={s.fieldLabel}>{label}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {options.map(opt => {
          const sel = opt === value;
          const c   = color ?? COLORS.primary;
          return (
            <TouchableOpacity key={opt} onPress={() => onSelect(opt)}
              style={[s.chip, sel && { backgroundColor: c + '30', borderColor: c }]}>
              <Text style={[s.chipText, sel && { color: c, fontWeight: '700' }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.text, fontSize: 22, fontWeight: '800', marginBottom: 3 }}>{lead.name}</Text>
            <Text style={{ color: COLORS.textSub, fontSize: 14 }}>{lead.phone}</Text>
          </View>
        </View>

        {responseMins !== null ? (
          <View style={[s.slaBanner, { backgroundColor: responseMins <= 5 ? COLORS.success + '18' : COLORS.danger + '18' }]}>
            <Text style={{ color: responseMins <= 5 ? COLORS.success : COLORS.danger, fontSize: 12, fontWeight: '600' }}>
              ⏱ First response in {responseMins}m  {responseMins <= 5 ? '✓ Within SLA' : '⚠ SLA Breached'}
            </Text>
          </View>
        ) : lead.stage === 'New Lead' ? (
          <View style={[s.slaBanner, { backgroundColor: COLORS.warning + '18' }]}>
            <Text style={{ color: COLORS.warning, fontSize: 12, fontWeight: '600' }}>⏳ No response yet — SLA requires response within 5 minutes</Text>
          </View>
        ) : null}

        <Card style={{ marginBottom: 14 }}>
          <CardTitle title="Contact Info" />
          <InfoRow icon="📱" label="Phone"    value={lead.phone} />
          <InfoRow icon="📍" label="Location" value={lead.location} />
          <InfoRow icon="💰" label="Budget"   value={lead.budget ? `₹${lead.budget.toLocaleString()}/mo` : null} />
          <InfoRow icon="🔗" label="Source"   value={lead.source} valueColor={COLORS.primary} />
          <InfoRow icon="📅" label="Created"  value={fmtDateTime(lead.createdAt)} />
          <InfoRow icon="👤" label="Agent"    value={agent?.name} />
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <CardTitle title="Pipeline Stage" />
          <ChipRow label="" value={stage} options={STAGES} onSelect={(v) => setStage(v as Stage)} />
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <CardTitle title="Assigned Agent" />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {state.agents.map(a => (
              <TouchableOpacity key={a.id} onPress={() => setAgentId(a.id)}
                style={[s.agentChip, agentId === a.id && s.agentChipSel]}>
                <Avatar initials={a.avatar} size={32} online={a.active} />
                <Text style={[s.agentName, agentId === a.id && { color: COLORS.primary }]}>{a.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Visit */}
        <Card style={{ marginBottom: 14 }}>
          <CardTitle title="Visit Scheduling" />
          {lead.visitDate ? (
            <InfoRow icon="🗓" label="Scheduled" value={fmtDateTime(lead.visitDate)} valueColor={COLORS.warning} />
          ) : (
            <Text style={{ color: COLORS.textDim, fontSize: 13, marginBottom: 12 }}>No visit scheduled yet.</Text>
          )}

          <Text style={s.fieldLabel}>Property</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {state.properties.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setVisitProperty(p.id)}
                style={[s.propChip, visitProperty === p.id && { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' }]}>
                <Text style={[{ color: COLORS.textSub, fontSize: 13, fontWeight: '600', marginBottom: 4 }, visitProperty === p.id && { color: COLORS.primary }]}>{p.name}</Text>
                <Text style={{ color: COLORS.textDim, fontSize: 11 }}>₹{p.rent.toLocaleString()} · {p.type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.fieldLabel}>Visit Outcome</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {VISIT_OUTCOMES.map(o => {
              const c = o === 'Booked' ? COLORS.success : o === 'Considering' ? COLORS.warning : COLORS.danger;
              const sel = visitOutcome === o;
              return (
                <TouchableOpacity key={o} onPress={() => setVisitOutcome(o)}
                  style={{ flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 9, alignItems: 'center', borderColor: c + (sel ? 'ff' : '44'), backgroundColor: sel ? c + '25' : 'transparent' }}>
                  <Text style={{ color: c, fontSize: 12, fontWeight: '700' }}>{o}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Notes */}
        <Card style={{ marginBottom: 14 }}>
          <CardTitle title="Notes & Activity" />
          {(lead.notes ?? []).length === 0 ? (
            <Text style={{ color: COLORS.textDim, fontSize: 13 }}>No notes yet.</Text>
          ) : [...lead.notes].reverse().map((n, i) => (
            <View key={i} style={{ backgroundColor: COLORS.surface2, borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <Text style={{ color: COLORS.textSub, fontSize: 13 }}>{n.text}</Text>
              <Text style={{ color: COLORS.textDim, fontSize: 10, marginTop: 3 }}>{fmtDateTime(n.at)}</Text>
            </View>
          ))}
          <Divider />
          <View style={{ gap: 8 }}>
            <TextInput
              value={noteText} onChangeText={setNoteText}
              placeholder="Add a note..." placeholderTextColor={COLORS.textDim}
              style={{ backgroundColor: COLORS.surface2, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border2, padding: 10, color: COLORS.text, fontSize: 13, minHeight: 60, textAlignVertical: 'top' }}
              multiline
            />
            <Btn onPress={addNote} label="Add Note" small variant="ghost" style={{ alignSelf: 'flex-end' }} />
          </View>
        </Card>

        <Btn onPress={save} label="Save Changes" variant="filled" />
        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  slaBanner: { borderRadius: 8, padding: 10, marginBottom: 14 },
  fieldLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  chip: { borderWidth: 1, borderColor: COLORS.border2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: COLORS.surface2 },
  chipText: { color: COLORS.textMuted, fontSize: 12 },
  agentChip: { alignItems: 'center', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, flex: 1, backgroundColor: COLORS.surface2 },
  agentChipSel: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  agentName: { color: COLORS.textSub, fontSize: 11, marginTop: 4, fontWeight: '600' },
  propChip: { borderWidth: 1, borderColor: COLORS.border2, borderRadius: 10, padding: 12, marginRight: 8, backgroundColor: COLORS.surface2, minWidth: 160 },
});