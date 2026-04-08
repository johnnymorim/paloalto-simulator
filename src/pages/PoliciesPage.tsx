import { useState } from 'react';
import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { PanModal } from '@/components/panos/PanModal';
import { PanTabs } from '@/components/panos/PanTabs';
import { PanFormField, PanInput, PanSelect } from '@/components/panos/PanFormField';
import { useFirewall } from '@/contexts/FirewallContext';
import { SecurityRule, NATRule } from '@/data/mockData';
import { Plus, Copy, ArrowUp, ArrowDown, Trash2, Pencil, Ban, Check } from 'lucide-react';

const sidebarItems: SidebarItem[] = [
  { id: 'security', label: 'Security', children: [
    { id: 'security-rules', label: 'Rules' },
  ]},
  { id: 'nat', label: 'NAT', children: [
    { id: 'nat-rules', label: 'Rules' },
  ]},
  { id: 'qos', label: 'QoS' },
  { id: 'pbf', label: 'Policy Based Forwarding' },
  { id: 'decryption', label: 'Decryption' },
  { id: 'app-override', label: 'Application Override' },
  { id: 'auth', label: 'Authentication' },
  { id: 'dos', label: 'DoS Protection' },
];

export const PoliciesPage = () => {
  const fw = useFirewall();
  const [activeSidebar, setActiveSidebar] = useState('security-rules');
  const [editingRule, setEditingRule] = useState<SecurityRule | null>(null);
  const [ruleForm, setRuleForm] = useState<SecurityRule | null>(null);
  const [showAddRule, setShowAddRule] = useState(false);
  const [editingNAT, setEditingNAT] = useState<NATRule | null>(null);
  const [natForm, setNatForm] = useState<NATRule | null>(null);
  const [showAddNAT, setShowAddNAT] = useState(false);

  const emptyRule: SecurityRule = {
    id: String(Date.now()), name: '', sourceZone: ['any'], sourceAddress: ['any'],
    destinationZone: ['any'], destinationAddress: ['any'], application: ['any'],
    service: ['application-default'], action: 'allow', profile: '', logStart: false,
    logEnd: true, disabled: false, hitCount: 0, description: '', tag: [],
  };

  const emptyNAT: NATRule = {
    id: String(Date.now()), name: '', type: 'source', sourceZone: ['any'],
    destinationZone: 'any', sourceAddress: ['any'], destinationAddress: 'any',
    service: 'any', translatedAddress: '', translatedPort: '', disabled: false, description: '',
  };

  const renderSecurityRules = () => (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Security Policy Rules</span>
        <div className="flex gap-1">
          <button onClick={() => { setRuleForm(emptyRule); setShowAddRule(true); }}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                  style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>
      <PanTable<SecurityRule>
        columns={[
          { key: '#', label: '#', width: '30px', render: (_, i) => <span>{i + 1}</span> },
          { key: 'name', label: 'Name', width: '140px', render: r => (
            <span style={{ color: r.disabled ? 'hsl(215, 10%, 65%)' : 'hsl(215, 25%, 15%)', textDecoration: r.disabled ? 'line-through' : 'none' }}>{r.name}</span>
          )},
          { key: 'sourceZone', label: 'Source Zone', width: '90px', render: r => r.sourceZone.join(', ') },
          { key: 'sourceAddress', label: 'Source Addr', width: '100px', render: r => r.sourceAddress.join(', ') },
          { key: 'destinationZone', label: 'Dest Zone', width: '90px', render: r => r.destinationZone.join(', ') },
          { key: 'destinationAddress', label: 'Dest Addr', width: '100px', render: r => r.destinationAddress.join(', ') },
          { key: 'application', label: 'Application', width: '110px', render: r => r.application.join(', ') },
          { key: 'action', label: 'Action', width: '60px', render: r => (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
              background: r.action === 'allow' ? 'hsl(100, 55%, 90%)' : 'hsl(0, 72%, 92%)',
              color: r.action === 'allow' ? 'hsl(100, 55%, 30%)' : 'hsl(0, 72%, 40%)',
            }}>{r.action}</span>
          )},
          { key: 'hitCount', label: 'Hits', width: '70px', render: r => r.hitCount.toLocaleString() },
          { key: 'actions', label: '', width: '100px', render: r => (
            <div className="flex gap-0.5">
              <button onClick={(e) => { e.stopPropagation(); setEditingRule(r); setRuleForm(r); }} title="Edit"><Pencil className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></button>
              <button onClick={(e) => { e.stopPropagation(); fw.cloneSecurityRule(r.id); }} title="Clone"><Copy className="w-3 h-3" style={{ color: 'hsl(215, 10%, 45%)' }} /></button>
              <button onClick={(e) => { e.stopPropagation(); fw.moveSecurityRule(r.id, 'up'); }} title="Move Up"><ArrowUp className="w-3 h-3" style={{ color: 'hsl(215, 10%, 45%)' }} /></button>
              <button onClick={(e) => { e.stopPropagation(); fw.moveSecurityRule(r.id, 'down'); }} title="Move Down"><ArrowDown className="w-3 h-3" style={{ color: 'hsl(215, 10%, 45%)' }} /></button>
              <button onClick={(e) => { e.stopPropagation(); fw.updateSecurityRule(r.id, { disabled: !r.disabled }); }} title={r.disabled ? 'Enable' : 'Disable'}>
                {r.disabled ? <Check className="w-3 h-3" style={{ color: 'hsl(100, 55%, 53%)' }} /> : <Ban className="w-3 h-3" style={{ color: 'hsl(30, 90%, 55%)' }} />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); fw.deleteSecurityRule(r.id); }} title="Delete"><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
            </div>
          )},
        ]}
        data={fw.securityRules}
        rowKey={r => r.id}
        onRowDoubleClick={r => { setEditingRule(r); setRuleForm(r); }}
      />
    </div>
  );

  const renderNATRules = () => (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>NAT Policy Rules</span>
        <button onClick={() => { setNatForm(emptyNAT); setShowAddNAT(true); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <PanTable<NATRule>
        columns={[
          { key: '#', label: '#', width: '30px', render: (_, i) => <span>{i + 1}</span> },
          { key: 'name', label: 'Name', width: '140px' },
          { key: 'type', label: 'Type', width: '80px', render: r => <span className="capitalize">{r.type}</span> },
          { key: 'sourceZone', label: 'Source Zone', width: '100px', render: r => r.sourceZone.join(', ') },
          { key: 'destinationZone', label: 'Dest Zone', width: '100px' },
          { key: 'destinationAddress', label: 'Dest Addr', width: '120px' },
          { key: 'translatedAddress', label: 'Translated Addr', width: '130px' },
          { key: 'translatedPort', label: 'Translated Port', width: '100px', render: r => r.translatedPort || '—' },
          { key: 'actions', label: '', width: '40px', render: r => (
            <button onClick={() => fw.deleteNATRule(r.id)}><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
          )},
        ]}
        data={fw.natRules}
        rowKey={r => r.id}
        onRowDoubleClick={r => { setEditingNAT(r); setNatForm(r); }}
      />
    </div>
  );

  const renderRuleModal = (isNew: boolean) => {
    if (!ruleForm) return null;
    return (
      <PanModal title={isNew ? 'Add Security Rule' : `Edit Rule — ${ruleForm.name}`} width="650px"
                onClose={() => { setEditingRule(null); setShowAddRule(false); setRuleForm(null); }}
                onSave={() => {
                  if (isNew) fw.addSecurityRule(ruleForm);
                  else fw.updateSecurityRule(ruleForm.id, ruleForm);
                  setEditingRule(null); setShowAddRule(false); setRuleForm(null);
                }}>
        <PanTabs tabs={[
          { id: 'general', label: 'General', content: (
            <div className="space-y-1">
              <PanFormField label="Name" required><PanInput value={ruleForm.name} onChange={v => setRuleForm(f => f ? { ...f, name: v } : f)} /></PanFormField>
              <PanFormField label="Description"><PanInput value={ruleForm.description} onChange={v => setRuleForm(f => f ? { ...f, description: v } : f)} /></PanFormField>
              <PanFormField label="Tag"><PanInput value={ruleForm.tag.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, tag: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
            </div>
          )},
          { id: 'source', label: 'Source', content: (
            <div className="space-y-1">
              <PanFormField label="Source Zone"><PanInput value={ruleForm.sourceZone.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, sourceZone: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
              <PanFormField label="Source Address"><PanInput value={ruleForm.sourceAddress.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, sourceAddress: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
            </div>
          )},
          { id: 'destination', label: 'Destination', content: (
            <div className="space-y-1">
              <PanFormField label="Dest Zone"><PanInput value={ruleForm.destinationZone.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, destinationZone: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
              <PanFormField label="Dest Address"><PanInput value={ruleForm.destinationAddress.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, destinationAddress: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
            </div>
          )},
          { id: 'application', label: 'Application', content: (
            <div className="space-y-1">
              <PanFormField label="Application"><PanInput value={ruleForm.application.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, application: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
              <PanFormField label="Service"><PanInput value={ruleForm.service.join(', ')} onChange={v => setRuleForm(f => f ? { ...f, service: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
            </div>
          )},
          { id: 'actions', label: 'Actions', content: (
            <div className="space-y-1">
              <PanFormField label="Action"><PanSelect value={ruleForm.action} onChange={v => setRuleForm(f => f ? { ...f, action: v as SecurityRule['action'] } : f)} options={[{ value: 'allow', label: 'Allow' }, { value: 'deny', label: 'Deny' }, { value: 'drop', label: 'Drop' }, { value: 'reset-both', label: 'Reset Both' }]} /></PanFormField>
              <PanFormField label="Profile"><PanInput value={ruleForm.profile} onChange={v => setRuleForm(f => f ? { ...f, profile: v } : f)} /></PanFormField>
              <PanFormField label="Log at Start">
                <label className="flex items-center gap-1 text-[11px]">
                  <input type="checkbox" checked={ruleForm.logStart} onChange={e => setRuleForm(f => f ? { ...f, logStart: e.target.checked } : f)} /> Enable
                </label>
              </PanFormField>
              <PanFormField label="Log at End">
                <label className="flex items-center gap-1 text-[11px]">
                  <input type="checkbox" checked={ruleForm.logEnd} onChange={e => setRuleForm(f => f ? { ...f, logEnd: e.target.checked } : f)} /> Enable
                </label>
              </PanFormField>
            </div>
          )},
        ]} />
      </PanModal>
    );
  };

  const renderNATModal = (isNew: boolean) => {
    if (!natForm) return null;
    return (
      <PanModal title={isNew ? 'Add NAT Rule' : `Edit NAT — ${natForm.name}`} width="550px"
                onClose={() => { setEditingNAT(null); setShowAddNAT(false); setNatForm(null); }}
                onSave={() => {
                  if (isNew) fw.addNATRule(natForm);
                  else fw.updateNATRule(natForm.id, natForm);
                  setEditingNAT(null); setShowAddNAT(false); setNatForm(null);
                }}>
        <PanTabs tabs={[
          { id: 'original', label: 'Original Packet', content: (
            <div className="space-y-1">
              <PanFormField label="Name" required><PanInput value={natForm.name} onChange={v => setNatForm(f => f ? { ...f, name: v } : f)} /></PanFormField>
              <PanFormField label="NAT Type"><PanSelect value={natForm.type} onChange={v => setNatForm(f => f ? { ...f, type: v as NATRule['type'] } : f)} options={[{ value: 'source', label: 'Source NAT' }, { value: 'destination', label: 'Destination NAT' }]} /></PanFormField>
              <PanFormField label="Source Zone"><PanInput value={natForm.sourceZone.join(', ')} onChange={v => setNatForm(f => f ? { ...f, sourceZone: v.split(',').map(s => s.trim()).filter(Boolean) } : f)} /></PanFormField>
              <PanFormField label="Dest Zone"><PanInput value={natForm.destinationZone} onChange={v => setNatForm(f => f ? { ...f, destinationZone: v } : f)} /></PanFormField>
              <PanFormField label="Dest Address"><PanInput value={natForm.destinationAddress} onChange={v => setNatForm(f => f ? { ...f, destinationAddress: v } : f)} /></PanFormField>
              <PanFormField label="Service"><PanInput value={natForm.service} onChange={v => setNatForm(f => f ? { ...f, service: v } : f)} /></PanFormField>
            </div>
          )},
          { id: 'translated', label: 'Translated Packet', content: (
            <div className="space-y-1">
              <PanFormField label="Translated Addr"><PanInput value={natForm.translatedAddress} onChange={v => setNatForm(f => f ? { ...f, translatedAddress: v } : f)} /></PanFormField>
              <PanFormField label="Translated Port"><PanInput value={natForm.translatedPort} onChange={v => setNatForm(f => f ? { ...f, translatedPort: v } : f)} /></PanFormField>
            </div>
          )},
        ]} />
      </PanModal>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">
        {activeSidebar === 'security-rules' && renderSecurityRules()}
        {activeSidebar === 'nat-rules' && renderNATRules()}
        {activeSidebar !== 'security-rules' && activeSidebar !== 'nat-rules' && (
          <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>Select Security or NAT rules from the sidebar.</div>
        )}
      </div>
      {(showAddRule || editingRule) && renderRuleModal(showAddRule)}
      {(showAddNAT || editingNAT) && renderNATModal(showAddNAT)}
    </div>
  );
};
