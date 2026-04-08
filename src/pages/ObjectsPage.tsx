import { useState } from 'react';
import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { PanModal } from '@/components/panos/PanModal';
import { PanFormField, PanInput, PanSelect } from '@/components/panos/PanFormField';
import { useFirewall } from '@/contexts/FirewallContext';
import { AddressObject, ServiceObject, SecurityProfile } from '@/data/mockData';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const sidebarItems: SidebarItem[] = [
  { id: 'addresses', label: 'Addresses' },
  { id: 'address-groups', label: 'Address Groups' },
  { id: 'services', label: 'Services' },
  { id: 'service-groups', label: 'Service Groups' },
  { id: 'applications', label: 'Applications' },
  { id: 'application-groups', label: 'Application Groups' },
  { id: 'security-profiles', label: 'Security Profiles', children: [
    { id: 'antivirus', label: 'Antivirus' },
    { id: 'anti-spyware', label: 'Anti-Spyware' },
    { id: 'vulnerability', label: 'Vulnerability Protection' },
    { id: 'url-filtering', label: 'URL Filtering' },
    { id: 'file-blocking', label: 'File Blocking' },
    { id: 'wildfire', label: 'WildFire Analysis' },
  ]},
  { id: 'security-profile-groups', label: 'Security Profile Groups' },
  { id: 'log-forwarding', label: 'Log Forwarding' },
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
    const filtered = fw.securityProfiles.filter(p => p.type === activeSidebar);
    const typeLabel = activeSidebar.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <div className="p-3 space-y-2">
        <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>{typeLabel} Profiles</span>
        <PanTable<SecurityProfile>
          columns={[
            { key: 'name', label: 'Name', width: '200px' },
            { key: 'description', label: 'Description' },
          ]}
          data={filtered}
          rowKey={r => r.name}
        />
      </div>
    );
  };

  const profileTypes = ['antivirus', 'anti-spyware', 'vulnerability', 'url-filtering', 'file-blocking', 'wildfire'];

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">
        {activeSidebar === 'addresses' && renderAddresses()}
        {activeSidebar === 'services' && renderServices()}
        {profileTypes.includes(activeSidebar) && renderSecurityProfiles()}
        {!['addresses', 'services', ...profileTypes].includes(activeSidebar) && (
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
    </div>
  );
};
