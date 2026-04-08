import { useState } from 'react';
import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { PanModal } from '@/components/panos/PanModal';
import { PanTabs } from '@/components/panos/PanTabs';
import { PanFormField, PanInput, PanSelect } from '@/components/panos/PanFormField';
import { useFirewall } from '@/contexts/FirewallContext';
import { AddressObject, ServiceObject, SecurityProfile } from '@/data/mockData';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const sidebarItems: SidebarItem[] = [
  { id: 'addresses', label: 'Addresses' },
  { id: 'address-groups', label: 'Address Groups' },
  { id: 'regions', label: 'Regions' },
  { id: 'services', label: 'Services' },
  { id: 'service-groups', label: 'Service Groups' },
  { id: 'applications', label: 'Applications' },
  { id: 'application-groups', label: 'Application Groups' },
  { id: 'application-filters', label: 'Application Filters' },
  { id: 'security-profiles', label: 'Security Profiles', children: [
    { id: 'antivirus', label: 'Antivirus' },
    { id: 'anti-spyware', label: 'Anti-Spyware' },
    { id: 'vulnerability', label: 'Vulnerability Protection' },
    { id: 'url-filtering', label: 'URL Filtering' },
    { id: 'file-blocking', label: 'File Blocking' },
    { id: 'wildfire-analysis', label: 'WildFire Analysis' },
    { id: 'data-filtering', label: 'Data Filtering' },
  ]},
  { id: 'security-profile-groups', label: 'Security Profile Groups' },
  { id: 'log-forwarding', label: 'Log Forwarding' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'decryption-profile', label: 'Decryption Profile' },
  { id: 'custom-objects', label: 'Custom Objects', children: [
    { id: 'custom-spyware', label: 'Spyware' },
    { id: 'custom-vulnerability', label: 'Vulnerability' },
    { id: 'custom-url-category', label: 'URL Category' },
  ]},
  { id: 'edl', label: 'External Dynamic Lists' },
  { id: 'hip-objects', label: 'GlobalProtect', children: [
    { id: 'hip-objects-list', label: 'HIP Objects' },
    { id: 'hip-profiles', label: 'HIP Profiles' },
  ]},
  { id: 'schedules', label: 'Schedules' },
  { id: 'tags', label: 'Tags' },
];

export const ObjectsPage = () => {
  const fw = useFirewall();
  const [activeSidebar, setActiveSidebar] = useState('addresses');
  const [editingAddr, setEditingAddr] = useState<AddressObject | null>(null);
  const [addrForm, setAddrForm] = useState<AddressObject>({ name: '', type: 'IP Netmask', value: '', description: '', tag: [] });
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [editingSvc, setEditingSvc] = useState<ServiceObject | null>(null);
  const [svcForm, setSvcForm] = useState<ServiceObject>({ name: '', protocol: 'TCP', destinationPort: '', sourcePort: '', description: '' });
  const [showAddSvc, setShowAddSvc] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SecurityProfile | null>(null);

  const renderAddresses = () => (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Address Objects</span>
        <button onClick={() => { setAddrForm({ name: '', type: 'IP Netmask', value: '', description: '', tag: [] }); setShowAddAddr(true); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <PanTable<AddressObject>
        columns={[
          { key: 'name', label: 'Name', width: '150px' },
          { key: 'type', label: 'Type', width: '100px' },
          { key: 'value', label: 'Address', width: '200px' },
          { key: 'description', label: 'Description' },
          { key: 'tag', label: 'Tags', width: '120px', render: r => r.tag.join(', ') },
          { key: 'actions', label: '', width: '60px', render: r => (
            <div className="flex gap-1">
              <button onClick={() => { setEditingAddr(r); setAddrForm(r); }}><Pencil className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></button>
              <button onClick={() => fw.deleteAddressObject(r.name)}><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
            </div>
          )},
        ]}
        data={fw.addressObjects}
        rowKey={r => r.name}
        onRowDoubleClick={r => { setEditingAddr(r); setAddrForm(r); }}
      />
    </div>
  );

  const renderAddressGroups = () => (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Address Groups</span>
        <button className="flex items-center gap-1 px-2 py-1 text-[11px] rounded" style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}><Plus className="w-3 h-3" /> Add</button>
      </div>
      <PanTable columns={[
        { key: 'name', label: 'Name', width: '150px' },
        { key: 'type', label: 'Type', width: '80px', render: (r: any) => r.type },
        { key: 'members', label: 'Members', render: (r: any) => r.type === 'static' ? r.members.join(', ') : r.filter },
        { key: 'description', label: 'Description' },
      ]} data={fw.addressGroups} rowKey={(r: any) => r.name} />
    </div>
  );

  const renderServices = () => (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Service Objects</span>
        <button onClick={() => { setSvcForm({ name: '', protocol: 'TCP', destinationPort: '', sourcePort: '', description: '' }); setShowAddSvc(true); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <PanTable<ServiceObject>
        columns={[
          { key: 'name', label: 'Name', width: '150px' },
          { key: 'protocol', label: 'Protocol', width: '80px' },
          { key: 'destinationPort', label: 'Dest Port', width: '100px' },
          { key: 'sourcePort', label: 'Source Port', width: '100px', render: r => r.sourcePort || 'Any' },
          { key: 'description', label: 'Description' },
          { key: 'actions', label: '', width: '60px', render: r => (
            <div className="flex gap-1">
              <button onClick={() => { setEditingSvc(r); setSvcForm(r); }}><Pencil className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></button>
              <button onClick={() => fw.deleteServiceObject(r.name)}><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
            </div>
          )},
        ]}
        data={fw.serviceObjects}
        rowKey={r => r.name}
        onRowDoubleClick={r => { setEditingSvc(r); setSvcForm(r); }}
      />
    </div>
  );

  const renderSecurityProfiles = () => {
    const profileTypeMap: Record<string, string> = {
      'antivirus': 'antivirus', 'anti-spyware': 'anti-spyware', 'vulnerability': 'vulnerability',
      'url-filtering': 'url-filtering', 'file-blocking': 'file-blocking', 'wildfire-analysis': 'wildfire-analysis',
    };
    const pType = profileTypeMap[activeSidebar];
    const filtered = fw.securityProfiles.filter(p => p.type === pType);
    const typeLabel = activeSidebar.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>{typeLabel} Profiles</span>
          <button className="flex items-center gap-1 px-2 py-1 text-[11px] rounded" style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}><Plus className="w-3 h-3" /> Add</button>
        </div>
        <PanTable<SecurityProfile>
          columns={[
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'description', label: 'Description' },
          ]}
          data={filtered}
          rowKey={r => r.name}
          onRowDoubleClick={r => setEditingProfile(r)}
        />
      </div>
    );
  };

  const renderProfileModal = () => {
    if (!editingProfile) return null;
    const p = editingProfile;

    const tabs = [
      { id: 'general', label: 'General', content: (
        <div className="space-y-1">
          <PanFormField label="Name"><PanInput value={p.name} onChange={() => {}} disabled /></PanFormField>
          <PanFormField label="Description"><PanInput value={p.description} onChange={() => {}} disabled /></PanFormField>
        </div>
      )},
    ];

    if (p.type === 'antivirus' && p.decoderActions) {
      tabs.push({ id: 'decoders', label: 'Decoders', content: (
        <div className="space-y-1">
          {Object.entries(p.decoderActions).map(([decoder, action]) => (
            <div key={decoder} className="flex items-center justify-between py-1 border-b text-[11px]" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
              <span className="uppercase font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{decoder}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{
                background: action.includes('reset') || action === 'drop' ? 'hsl(0, 72%, 92%)' : action === 'alert' ? 'hsl(45, 100%, 92%)' : 'hsl(100, 55%, 90%)',
                color: action.includes('reset') || action === 'drop' ? 'hsl(0, 72%, 40%)' : action === 'alert' ? 'hsl(30, 80%, 35%)' : 'hsl(100, 55%, 30%)',
              }}>{action}</span>
            </div>
          ))}
        </div>
      )});
    }

    if ((p.type === 'anti-spyware' || p.type === 'vulnerability') && p.severityActions) {
      tabs.push({ id: 'rules', label: 'Rules', content: (
        <div className="space-y-1">
          <div className="text-[11px] font-medium mb-1" style={{ color: 'hsl(215, 10%, 45%)' }}>Severity-based Actions</div>
          {Object.entries(p.severityActions).map(([sev, action]) => (
            <div key={sev} className="flex items-center justify-between py-1 border-b text-[11px]" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
              <span className="capitalize font-medium" style={{ color: 'hsl(215, 25%, 15%)' }}>{sev}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{
                background: action.includes('reset') || action === 'drop' ? 'hsl(0, 72%, 92%)' : action === 'alert' ? 'hsl(45, 100%, 92%)' : 'hsl(210, 10%, 94%)',
                color: action.includes('reset') || action === 'drop' ? 'hsl(0, 72%, 40%)' : action === 'alert' ? 'hsl(30, 80%, 35%)' : 'hsl(215, 10%, 45%)',
              }}>{action}</span>
            </div>
          ))}
        </div>
      )});
    }

    if (p.type === 'url-filtering' && p.categories) {
      tabs.push({ id: 'categories', label: 'Categories', content: (
        <div className="space-y-1 max-h-[300px] overflow-auto">
          {Object.entries(p.categories).map(([cat, action]) => (
            <div key={cat} className="flex items-center justify-between py-1 border-b text-[11px]" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{cat}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px]" style={{
                background: action === 'block' ? 'hsl(0, 72%, 92%)' : action === 'alert' ? 'hsl(45, 100%, 92%)' : 'hsl(100, 55%, 90%)',
                color: action === 'block' ? 'hsl(0, 72%, 40%)' : action === 'alert' ? 'hsl(30, 80%, 35%)' : 'hsl(100, 55%, 30%)',
              }}>{action}</span>
            </div>
          ))}
        </div>
      )});
    }

    if (p.type === 'file-blocking' && p.rules) {
      tabs.push({ id: 'rules', label: 'Rules', content: (
        <div className="space-y-1">
          <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold py-1 border-b" style={{ borderColor: 'hsl(214, 20%, 82%)', color: 'hsl(215, 10%, 45%)' }}>
            <span>File Type</span><span>Direction</span><span>Action</span>
          </div>
          {p.rules.map((r, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 text-[11px] py-1 border-b" style={{ borderColor: 'hsl(210, 10%, 94%)' }}>
              <span style={{ color: 'hsl(215, 25%, 15%)' }}>{r.fileType}</span>
              <span style={{ color: 'hsl(215, 10%, 45%)' }}>{r.direction}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] w-fit" style={{
                background: r.action === 'block' ? 'hsl(0, 72%, 92%)' : 'hsl(45, 100%, 92%)',
                color: r.action === 'block' ? 'hsl(0, 72%, 40%)' : 'hsl(30, 80%, 35%)',
              }}>{r.action}</span>
            </div>
          ))}
        </div>
      )});
    }

    return (
      <PanModal title={`${p.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Profile — ${p.name}`} width="550px"
                onClose={() => setEditingProfile(null)}>
        <PanTabs tabs={tabs} />
      </PanModal>
    );
  };

  const profileTypes = ['antivirus', 'anti-spyware', 'vulnerability', 'url-filtering', 'file-blocking', 'wildfire-analysis', 'data-filtering'];

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">
        {activeSidebar === 'addresses' && renderAddresses()}
        {activeSidebar === 'address-groups' && renderAddressGroups()}
        {activeSidebar === 'services' && renderServices()}
        {profileTypes.includes(activeSidebar) && renderSecurityProfiles()}
        {!['addresses', 'address-groups', 'services', ...profileTypes].includes(activeSidebar) && (
          <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>Select a category from the sidebar.</div>
        )}
      </div>

      {(showAddAddr || editingAddr) && (
        <PanModal title={editingAddr ? `Edit Address — ${editingAddr.name}` : 'Add Address Object'} width="450px"
                  onClose={() => { setShowAddAddr(false); setEditingAddr(null); }}
                  onSave={() => {
                    if (editingAddr) fw.updateAddressObject(editingAddr.name, addrForm);
                    else fw.addAddressObject(addrForm);
                    setShowAddAddr(false); setEditingAddr(null);
                  }}>
          <div className="space-y-1">
            <PanFormField label="Name" required><PanInput value={addrForm.name} onChange={v => setAddrForm(f => ({ ...f, name: v }))} disabled={!!editingAddr} /></PanFormField>
            <PanFormField label="Type"><PanSelect value={addrForm.type} onChange={v => setAddrForm(f => ({ ...f, type: v as AddressObject['type'] }))} options={[{ value: 'IP Netmask', label: 'IP Netmask' }, { value: 'IP Range', label: 'IP Range' }, { value: 'FQDN', label: 'FQDN' }]} /></PanFormField>
            <PanFormField label="Value" required><PanInput value={addrForm.value} onChange={v => setAddrForm(f => ({ ...f, value: v }))} /></PanFormField>
            <PanFormField label="Description"><PanInput value={addrForm.description} onChange={v => setAddrForm(f => ({ ...f, description: v }))} /></PanFormField>
            <PanFormField label="Tags"><PanInput value={addrForm.tag.join(', ')} onChange={v => setAddrForm(f => ({ ...f, tag: v.split(',').map(s => s.trim()).filter(Boolean) }))} /></PanFormField>
          </div>
        </PanModal>
      )}

      {(showAddSvc || editingSvc) && (
        <PanModal title={editingSvc ? `Edit Service — ${editingSvc.name}` : 'Add Service Object'} width="450px"
                  onClose={() => { setShowAddSvc(false); setEditingSvc(null); }}
                  onSave={() => {
                    if (editingSvc) fw.updateServiceObject(editingSvc.name, svcForm);
                    else fw.addServiceObject(svcForm);
                    setShowAddSvc(false); setEditingSvc(null);
                  }}>
          <div className="space-y-1">
            <PanFormField label="Name" required><PanInput value={svcForm.name} onChange={v => setSvcForm(f => ({ ...f, name: v }))} disabled={!!editingSvc} /></PanFormField>
            <PanFormField label="Protocol"><PanSelect value={svcForm.protocol} onChange={v => setSvcForm(f => ({ ...f, protocol: v as ServiceObject['protocol'] }))} options={[{ value: 'TCP', label: 'TCP' }, { value: 'UDP', label: 'UDP' }, { value: 'TCP/UDP', label: 'TCP/UDP' }]} /></PanFormField>
            <PanFormField label="Dest Port" required><PanInput value={svcForm.destinationPort} onChange={v => setSvcForm(f => ({ ...f, destinationPort: v }))} placeholder="e.g. 80, 443, 8000-8080" /></PanFormField>
            <PanFormField label="Source Port"><PanInput value={svcForm.sourcePort} onChange={v => setSvcForm(f => ({ ...f, sourcePort: v }))} placeholder="Optional" /></PanFormField>
            <PanFormField label="Description"><PanInput value={svcForm.description} onChange={v => setSvcForm(f => ({ ...f, description: v }))} /></PanFormField>
          </div>
        </PanModal>
      )}

      {editingProfile && renderProfileModal()}
    </div>
  );
};
