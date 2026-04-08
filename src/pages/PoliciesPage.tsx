import { useState } from 'react';
import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { PanModal } from '@/components/panos/PanModal';
import { PanTabs } from '@/components/panos/PanTabs';
import { PanFormField, PanInput, PanSelect } from '@/components/panos/PanFormField';
import { useFirewall } from '@/contexts/FirewallContext';
import { SecurityRule, NATRule } from '@/data/mockData';
import { Plus, Copy, ArrowUp, ArrowDown, Trash2, Pencil, Ban, Check, Shield, FileText } from 'lucide-react';

const sidebarItems: SidebarItem[] = [
  { id: 'security', label: 'Security', children: [{ id: 'security-rules', label: 'Rules' }] },
  { id: 'nat', label: 'NAT', children: [{ id: 'nat-rules', label: 'Rules' }] },
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
    id: String(Date.now()), name: '', ruleType: 'universal', sourceZone: ['any'], sourceAddress: ['any'], negateSource: false, sourceUser: ['any'],
    destinationZone: ['any'], destinationAddress: ['any'], negateDestination: false, application: ['any'],
    service: ['application-default'], urlCategory: ['any'], action: 'allow', profile: '', profileType: 'none',
    logStart: false, logEnd: true, logForwarding: '', schedule: '', qosMarking: '', disableServerResponseInspection: false,
    disabled: false, hitCount: 0, description: '', tag: [],
  };

  const emptyNAT: NATRule = {
    id: String(Date.now()), name: '', description: '', tag: [], natType: 'ipv4',
    sourceZone: ['any'], destinationZone: 'any', destinationInterface: 'any', sourceAddress: ['any'],
    destinationAddress: 'any', service: 'any', sourceTranslationType: 'None',
    sourceTranslatedAddress: '', sourceTranslatedInterface: '', biDirectional: false,
    destinationTranslatedAddress: '', destinationTranslatedPort: '', disabled: false,
  };

  const rf = (fn: (f: SecurityRule) => SecurityRule) => setRuleForm(f => f ? fn(f) : f);
  const nf = (fn: (f: NATRule) => NATRule) => setNatForm(f => f ? fn(f) : f);

  const renderSecurityRules = () => (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Security Policy Rules</span>
        <button onClick={() => { setRuleForm({ ...emptyRule, id: String(Date.now()) }); setShowAddRule(true); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <PanTable<SecurityRule>
        columns={[
          { key: '#', label: '#', width: '30px', render: (_, i) => <span>{i + 1}</span> },
          { key: 'name', label: 'Name', width: '120px', render: r => (
            <span style={{ color: r.disabled ? 'hsl(215, 10%, 65%)' : 'hsl(215, 25%, 15%)', textDecoration: r.disabled ? 'line-through' : 'none' }}>{r.name}</span>
          )},
          { key: 'sourceZone', label: 'Source Zone', width: '80px', render: r => r.sourceZone.join(', ') },
          { key: 'sourceAddress', label: 'Source Addr', width: '90px', render: r => <span>{r.negateSource ? 'NOT ' : ''}{r.sourceAddress.join(', ')}</span> },
          { key: 'sourceUser', label: 'User', width: '60px', render: r => r.sourceUser.join(', ') },
          { key: 'destinationZone', label: 'Dest Zone', width: '80px', render: r => r.destinationZone.join(', ') },
          { key: 'destinationAddress', label: 'Dest Addr', width: '90px', render: r => <span>{r.negateDestination ? 'NOT ' : ''}{r.destinationAddress.join(', ')}</span> },
          { key: 'application', label: 'Application', width: '100px', render: r => r.application.join(', ') },
          { key: 'service', label: 'Service', width: '80px', render: r => r.service.join(', ') },
          { key: 'action', label: 'Action', width: '55px', render: r => (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{
              background: r.action === 'allow' ? 'hsl(100, 55%, 90%)' : 'hsl(0, 72%, 92%)',
              color: r.action === 'allow' ? 'hsl(100, 55%, 30%)' : 'hsl(0, 72%, 40%)',
            }}>{r.action}</span>
          )},
          { key: 'profile', label: 'Profile', width: '60px', render: r => r.profile ? (
            <span title={r.profile}><Shield className="w-3 h-3 inline" style={{ color: 'hsl(100, 55%, 40%)' }} /></span>
          ) : <span style={{ color: 'hsl(215, 10%, 65%)' }}>—</span> },
          { key: 'options', label: 'Opt', width: '30px', render: r => r.logForwarding ? (
            <span title={`Log: ${r.logForwarding}`}><FileText className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></span>
          ) : null },
          { key: 'hitCount', label: 'Hits', width: '60px', render: r => r.hitCount.toLocaleString() },
          { key: 'actions', label: '', width: '100px', render: r => (
            <div className="flex gap-0.5">
              <button onClick={e => { e.stopPropagation(); setEditingRule(r); setRuleForm(r); }} title="Edit"><Pencil className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></button>
              <button onClick={e => { e.stopPropagation(); fw.cloneSecurityRule(r.id); }} title="Clone"><Copy className="w-3 h-3" style={{ color: 'hsl(215, 10%, 45%)' }} /></button>
              <button onClick={e => { e.stopPropagation(); fw.moveSecurityRule(r.id, 'up'); }} title="Move Up"><ArrowUp className="w-3 h-3" style={{ color: 'hsl(215, 10%, 45%)' }} /></button>
              <button onClick={e => { e.stopPropagation(); fw.moveSecurityRule(r.id, 'down'); }} title="Move Down"><ArrowDown className="w-3 h-3" style={{ color: 'hsl(215, 10%, 45%)' }} /></button>
              <button onClick={e => { e.stopPropagation(); fw.updateSecurityRule(r.id, { disabled: !r.disabled }); }} title={r.disabled ? 'Enable' : 'Disable'}>
                {r.disabled ? <Check className="w-3 h-3" style={{ color: 'hsl(100, 55%, 53%)' }} /> : <Ban className="w-3 h-3" style={{ color: 'hsl(30, 90%, 55%)' }} />}
              </button>
              <button onClick={e => { e.stopPropagation(); fw.deleteSecurityRule(r.id); }} title="Delete"><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
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
        <button onClick={() => { setNatForm({ ...emptyNAT, id: String(Date.now()) }); setShowAddNAT(true); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <PanTable<NATRule>
        columns={[
          { key: '#', label: '#', width: '30px', render: (_, i) => <span>{i + 1}</span> },
          { key: 'name', label: 'Name', width: '130px' },
          { key: 'sourceZone', label: 'Src Zone', width: '80px', render: r => r.sourceZone.join(', ') },
          { key: 'destinationZone', label: 'Dst Zone', width: '80px' },
          { key: 'sourceAddress', label: 'Src Addr', width: '80px', render: r => r.sourceAddress.join(', ') },
          { key: 'destinationAddress', label: 'Dst Addr', width: '110px' },
          { key: 'service', label: 'Service', width: '80px' },
          { key: 'sourceTranslationType', label: 'Src Translation', width: '110px' },
          { key: 'destinationTranslatedAddress', label: 'Dst Translation', width: '100px', render: r => r.destinationTranslatedAddress || '—' },
          { key: 'actions', label: '', width: '60px', render: r => (
            <div className="flex gap-1">
              <button onClick={() => { setEditingNAT(r); setNatForm(r); }}><Pencil className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></button>
              <button onClick={() => fw.deleteNATRule(r.id)}><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
            </div>
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
      <PanModal title={isNew ? 'Security Policy Rule' : `Security Policy Rule — ${ruleForm.name}`} width="700px"
                onClose={() => { setEditingRule(null); setShowAddRule(false); setRuleForm(null); }}
                onSave={() => {
                  if (isNew) fw.addSecurityRule(ruleForm);
                  else fw.updateSecurityRule(ruleForm.id, ruleForm);
                  setEditingRule(null); setShowAddRule(false); setRuleForm(null);
                }}>
        <PanTabs tabs={[
          { id: 'general', label: 'General', content: (
            <div className="space-y-1">
              <PanFormField label="Name" required><PanInput value={ruleForm.name} onChange={v => rf(f => ({ ...f, name: v }))} /></PanFormField>
              <PanFormField label="Rule Type"><PanSelect value={ruleForm.ruleType} onChange={v => rf(f => ({ ...f, ruleType: v as SecurityRule['ruleType'] }))} options={[{ value: 'universal', label: 'universal' }, { value: 'intrazone', label: 'intrazone' }, { value: 'interzone', label: 'interzone' }]} /></PanFormField>
              <PanFormField label="Description"><PanInput value={ruleForm.description} onChange={v => rf(f => ({ ...f, description: v }))} /></PanFormField>
              <PanFormField label="Tag"><PanInput value={ruleForm.tag.join(', ')} onChange={v => rf(f => ({ ...f, tag: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
            </div>
          )},
          { id: 'source', label: 'Source', content: (
            <div className="space-y-1">
              <PanFormField label="Source Zone"><PanInput value={ruleForm.sourceZone.join(', ')} onChange={v => rf(f => ({ ...f, sourceZone: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
              <PanFormField label="Source Address"><PanInput value={ruleForm.sourceAddress.join(', ')} onChange={v => rf(f => ({ ...f, sourceAddress: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
              <PanFormField label="Negate Source">
                <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={ruleForm.negateSource} onChange={e => rf(f => ({ ...f, negateSource: e.target.checked }))} /> Negate</label>
              </PanFormField>
              <PanFormField label="Source User"><PanInput value={ruleForm.sourceUser.join(', ')} onChange={v => rf(f => ({ ...f, sourceUser: v.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="any, known-user, unknown, pre-logon" /></PanFormField>
            </div>
          )},
          { id: 'destination', label: 'Destination', content: (
            <div className="space-y-1">
              <PanFormField label="Destination Zone"><PanInput value={ruleForm.destinationZone.join(', ')} onChange={v => rf(f => ({ ...f, destinationZone: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
              <PanFormField label="Destination Address"><PanInput value={ruleForm.destinationAddress.join(', ')} onChange={v => rf(f => ({ ...f, destinationAddress: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
              <PanFormField label="Negate Destination">
                <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={ruleForm.negateDestination} onChange={e => rf(f => ({ ...f, negateDestination: e.target.checked }))} /> Negate</label>
              </PanFormField>
            </div>
          )},
          { id: 'application', label: 'Application', content: (
            <div className="space-y-1">
              <PanFormField label="Application"><PanInput value={ruleForm.application.join(', ')} onChange={v => rf(f => ({ ...f, application: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
            </div>
          )},
          { id: 'service-url', label: 'Service/URL Category', content: (
            <div className="space-y-1">
              <PanFormField label="Service"><PanInput value={ruleForm.service.join(', ')} onChange={v => rf(f => ({ ...f, service: v.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="application-default, any, service-http" /></PanFormField>
              <PanFormField label="URL Category"><PanInput value={ruleForm.urlCategory.join(', ')} onChange={v => rf(f => ({ ...f, urlCategory: v.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="any" /></PanFormField>
            </div>
          )},
          { id: 'actions', label: 'Actions', content: (
            <div className="space-y-1">
              <PanFormField label="Action"><PanSelect value={ruleForm.action} onChange={v => rf(f => ({ ...f, action: v as SecurityRule['action'] }))} options={[{ value: 'allow', label: 'Allow' }, { value: 'deny', label: 'Deny' }, { value: 'drop', label: 'Drop' }, { value: 'reset-client', label: 'Reset Client' }, { value: 'reset-server', label: 'Reset Server' }, { value: 'reset-both', label: 'Reset Both' }]} /></PanFormField>
              <PanFormField label="Profile Setting"><PanSelect value={ruleForm.profileType} onChange={v => rf(f => ({ ...f, profileType: v as SecurityRule['profileType'] }))} options={[{ value: 'none', label: 'None' }, { value: 'group', label: 'Group' }, { value: 'profiles', label: 'Profiles' }]} /></PanFormField>
              {ruleForm.profileType !== 'none' && (
                <PanFormField label="Security Profile Group"><PanInput value={ruleForm.profile} onChange={v => rf(f => ({ ...f, profile: v }))} /></PanFormField>
              )}
              <PanFormField label="Log at Session Start">
                <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={ruleForm.logStart} onChange={e => rf(f => ({ ...f, logStart: e.target.checked }))} /> Enable</label>
              </PanFormField>
              <PanFormField label="Log at Session End">
                <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={ruleForm.logEnd} onChange={e => rf(f => ({ ...f, logEnd: e.target.checked }))} /> Enable</label>
              </PanFormField>
              <PanFormField label="Log Forwarding"><PanInput value={ruleForm.logForwarding} onChange={v => rf(f => ({ ...f, logForwarding: v }))} placeholder="default" /></PanFormField>
              <PanFormField label="Schedule"><PanInput value={ruleForm.schedule} onChange={v => rf(f => ({ ...f, schedule: v }))} placeholder="None" /></PanFormField>
              <PanFormField label="QoS Marking"><PanSelect value={ruleForm.qosMarking || 'none'} onChange={v => rf(f => ({ ...f, qosMarking: v === 'none' ? '' : v }))} options={[{ value: 'none', label: 'None' }, { value: 'ip-dscp', label: 'IP DSCP' }, { value: 'ip-precedence', label: 'IP Precedence' }, { value: 'follow-c2s-flow', label: 'Follow C2S Flow' }]} /></PanFormField>
              <PanFormField label="Disable Server Response Inspection">
                <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={ruleForm.disableServerResponseInspection} onChange={e => rf(f => ({ ...f, disableServerResponseInspection: e.target.checked }))} /> Disable</label>
              </PanFormField>
            </div>
          )},
          { id: 'target', label: 'Target', content: (
            <div className="p-3 text-[11px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
              <p>Target settings are used when managing devices through Panorama.</p>
              <p className="mt-2">In this standalone device configuration, all rules apply to the local device.</p>
            </div>
          )},
        ]} />
      </PanModal>
    );
  };

  const renderNATModal = (isNew: boolean) => {
    if (!natForm) return null;
    return (
      <PanModal title={isNew ? 'NAT Policy Rule' : `NAT Policy Rule — ${natForm.name}`} width="600px"
                onClose={() => { setEditingNAT(null); setShowAddNAT(false); setNatForm(null); }}
                onSave={() => {
                  if (isNew) fw.addNATRule(natForm);
                  else fw.updateNATRule(natForm.id, natForm);
                  setEditingNAT(null); setShowAddNAT(false); setNatForm(null);
                }}>
        <PanTabs tabs={[
          { id: 'general', label: 'General', content: (
            <div className="space-y-1">
              <PanFormField label="Name" required><PanInput value={natForm.name} onChange={v => nf(f => ({ ...f, name: v }))} /></PanFormField>
              <PanFormField label="Description"><PanInput value={natForm.description} onChange={v => nf(f => ({ ...f, description: v }))} /></PanFormField>
              <PanFormField label="NAT Type"><PanSelect value={natForm.natType} onChange={v => nf(f => ({ ...f, natType: v as NATRule['natType'] }))} options={[{ value: 'ipv4', label: 'ipv4' }, { value: 'nat64', label: 'nat64' }, { value: 'nptv6', label: 'nptv6' }]} /></PanFormField>
              <PanFormField label="Tag"><PanInput value={natForm.tag.join(', ')} onChange={v => nf(f => ({ ...f, tag: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
            </div>
          )},
          { id: 'original', label: 'Original Packet', content: (
            <div className="space-y-1">
              <PanFormField label="Source Zone"><PanInput value={natForm.sourceZone.join(', ')} onChange={v => nf(f => ({ ...f, sourceZone: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
              <PanFormField label="Destination Zone"><PanInput value={natForm.destinationZone} onChange={v => nf(f => ({ ...f, destinationZone: v }))} /></PanFormField>
              <PanFormField label="Destination Interface"><PanSelect value={natForm.destinationInterface} onChange={v => nf(f => ({ ...f, destinationInterface: v }))} options={[{ value: 'any', label: 'any' }, ...fw.interfaces.map(i => ({ value: i.name, label: i.name }))]} /></PanFormField>
              <PanFormField label="Source Address"><PanInput value={natForm.sourceAddress.join(', ')} onChange={v => nf(f => ({ ...f, sourceAddress: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
              <PanFormField label="Destination Address"><PanInput value={natForm.destinationAddress} onChange={v => nf(f => ({ ...f, destinationAddress: v }))} /></PanFormField>
              <PanFormField label="Service"><PanInput value={natForm.service} onChange={v => nf(f => ({ ...f, service: v }))} /></PanFormField>
            </div>
          )},
          { id: 'translated', label: 'Translated Packet', content: (
            <div className="space-y-3">
              <div className="border-b pb-2" style={{ borderColor: 'hsl(214, 20%, 82%)' }}>
                <div className="text-[11px] font-semibold mb-1" style={{ color: 'hsl(215, 25%, 15%)' }}>Source Address Translation</div>
                <div className="space-y-1">
                  <PanFormField label="Translation Type"><PanSelect value={natForm.sourceTranslationType} onChange={v => nf(f => ({ ...f, sourceTranslationType: v as NATRule['sourceTranslationType'] }))} options={[{ value: 'None', label: 'None' }, { value: 'Dynamic IP And Port', label: 'Dynamic IP And Port' }, { value: 'Dynamic IP', label: 'Dynamic IP' }, { value: 'Static IP', label: 'Static IP' }]} /></PanFormField>
                  {natForm.sourceTranslationType !== 'None' && (
                    <>
                      <PanFormField label="Translated Address"><PanInput value={natForm.sourceTranslatedAddress} onChange={v => nf(f => ({ ...f, sourceTranslatedAddress: v }))} /></PanFormField>
                      {natForm.sourceTranslationType === 'Dynamic IP And Port' && (
                        <PanFormField label="Interface"><PanSelect value={natForm.sourceTranslatedInterface} onChange={v => nf(f => ({ ...f, sourceTranslatedInterface: v }))} options={[{ value: '', label: 'None' }, ...fw.interfaces.map(i => ({ value: i.name, label: i.name }))]} /></PanFormField>
                      )}
                      {natForm.sourceTranslationType === 'Static IP' && (
                        <PanFormField label="Bi-directional">
                          <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={natForm.biDirectional} onChange={e => nf(f => ({ ...f, biDirectional: e.target.checked }))} /> Yes</label>
                        </PanFormField>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-semibold mb-1" style={{ color: 'hsl(215, 25%, 15%)' }}>Destination Address Translation</div>
                <div className="space-y-1">
                  <PanFormField label="Translated Address"><PanInput value={natForm.destinationTranslatedAddress} onChange={v => nf(f => ({ ...f, destinationTranslatedAddress: v }))} placeholder="None" /></PanFormField>
                  <PanFormField label="Translated Port"><PanInput value={natForm.destinationTranslatedPort} onChange={v => nf(f => ({ ...f, destinationTranslatedPort: v }))} /></PanFormField>
                </div>
              </div>
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
        {!['security-rules', 'nat-rules'].includes(activeSidebar) && (
          <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>Select Security or NAT rules from the sidebar.</div>
        )}
      </div>
      {(showAddRule || editingRule) && renderRuleModal(showAddRule)}
      {(showAddNAT || editingNAT) && renderNATModal(showAddNAT)}
    </div>
  );
};
