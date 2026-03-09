import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import { COLORS, STAGES, SOURCES } from '@/constants/theme';
import LeadCard from '@/components/LeadCard';
import { Btn } from '@/components/UI';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function AddLeadModal({ visible, onClose, agentName, onAdd }: {
  visible: boolean; onClose: () => void; agentName: string;
  onAdd: (d: { name: string; phone: string; source: string; budget: number; location: string }) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');

  const submit = () => {
    if (!name.trim() || !phone.trim() || !source) return;
    onAdd({ name: name.trim(), phone: phone.trim(), source, budget: parseInt(budget) || 0, location: location.trim() });
    setName(''); setPhone(''); setSource(''); setBudget(''); setLocation('');
    onClose();
  };


  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 6 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            alignItems: 'center'
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: COLORS.text, fontSize: 20, fontWeight: '800' }}>New Lead</Text>
            <TouchableOpacity onPress={onClose}><Text style={{ color: COLORS.textSub, fontSize: 18 }}>✕</Text></TouchableOpacity>
          </View>

          {[
            { label: 'Full Name *', value: name, set: setName, placeholder: 'e.g. Rahul Kumar', keyboard: 'default' },
            { label: 'Phone Number *', value: phone, set: setPhone, placeholder: '10-digit mobile', keyboard: 'phone-pad' },
            { label: 'Budget (₹/month)', value: budget, set: setBudget, placeholder: 'e.g. 9000', keyboard: 'numeric' },
            { label: 'Preferred Location', value: location, set: setLocation, placeholder: 'e.g. Koramangala', keyboard: 'default' },
          ].map(f => (
            <View key={f.label} style={{ marginBottom: 14 }}>
              <Text style={s.fieldLabel}>{f.label}</Text>
              <TextInput
                value={f.value} onChangeText={f.set}
                placeholder={f.placeholder} placeholderTextColor={COLORS.textDim}
                keyboardType={f.keyboard as any} style={s.input}
              />
            </View>
          ))}

          <View style={{ marginBottom: 14 }}>
            <Text style={s.fieldLabel}>Lead Source *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {SOURCES.map(src => (
                <TouchableOpacity key={src} onPress={() => setSource(src)}
                  style={[s.chip, source === src && s.chipSel]}>
                  <Text style={[s.chipText, source === src && { color: COLORS.primary, fontWeight: '700' }]}>{src}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={{ backgroundColor: COLORS.surface2, borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border }}>
            <Text style={{ color: COLORS.textSub, fontSize: 12 }}>
              ⚡ Auto-assigned to <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{agentName}</Text> via round-robin
            </Text>
          </View>

          <Btn onPress={submit} label="Create Lead" variant="filled" disabled={!name.trim() || !phone.trim() || !source} />
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function LeadsScreen() {
  const router = useRouter();
  const { state, dispatch } = useAppStore();
  const { leads, agents } = state;

  const [search, setSearch] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const filtered = leads.filter(l =>
    (!search || l.name.toLowerCase().startsWith(search.toLowerCase()) || l.phone.includes(search)) &&
    (!filterStage || l.stage === filterStage)
  );

  const nextAgent = agents[state.rrIndex % agents.length];

  return (
    <View style={s.screen}>
      <FlatList
        data={filtered}
        keyExtractor={l => l.id}
        ListHeaderComponent={
          <>
            <View style={s.searchRow}>
              <View style={s.searchWrap}>
                <MaterialCommunityIcons
                  name='magnify'
                  size={22}
                  color={COLORS.textDim}
                />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search name or phone..."
                  placeholderTextColor={COLORS.textDim}
                  style={{ flex: 1, color: COLORS.text, fontSize: 13, paddingVertical: 9, outline: 'none'}}
                />
              </View>

              <TouchableOpacity onPress={() => setAddOpen(true)} style={s.addBtn}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              style={{ marginBottom: 6 }}
            >
              {['', ...STAGES].map(st => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setFilterStage(st)}
                  style={[s.chip, filterStage === st && s.chipSel]}
                >
                  <Text
                    style={[
                      s.chipText,
                      filterStage === st && { color: COLORS.primary, fontWeight: '700' }
                    ]}
                  >
                    {st || 'All'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text
              style={{
                color: COLORS.textDim,
                fontSize: 12,
                paddingHorizontal: 16,
                marginBottom: 8
              }}
            >
              {filtered.length} leads
            </Text>
          </>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <LeadCard
            lead={item}
            agent={agents.find(a => a.id === item.agentId)}
            onPress={() =>
              router.push({ pathname: '/modal', params: { leadId: item.id } })
            }
          />
        )}
      />

      <AddLeadModal
        visible={addOpen}
        onClose={() => setAddOpen(false)}
        agentName={nextAgent?.name ?? ''}
        onAdd={data => dispatch({ type: 'ADD_LEAD', payload: data })}
      />
    </View>
  )
}

const s = StyleSheet.create({
  screen: {
    flex: 1, backgroundColor: COLORS.bg, alignItems: 'stretch',
    justifyContent: 'flex-start'
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface2, borderRadius: 10,
    borderWidth: 1, paddingHorizontal: 10,
  },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  fieldLabel: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 7 },
  input: { backgroundColor: COLORS.surface2, borderWidth: 1, borderRadius: 8, padding: 11, color: COLORS.text, fontSize: 13 },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 30,
    marginRight: 6,
    backgroundColor: COLORS.surface2,
    justifyContent: 'center'
  }, chipSel: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  chipText: { color: COLORS.textMuted, fontSize: 12 },
});
