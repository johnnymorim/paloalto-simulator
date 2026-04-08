import { useState } from 'react';
import { PanSidebar, SidebarItem } from '@/components/panos/PanSidebar';
import { PanTable } from '@/components/panos/PanTable';
import { PanModal } from '@/components/panos/PanModal';
import { PanTabs } from '@/components/panos/PanTabs';
import { PanFormField, PanInput, PanSelect } from '@/components/panos/PanFormField';
import { useFirewall } from '@/contexts/FirewallContext';
import { FirewallInterface, Zone, StaticRoute } from '@/data/mockData';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const sidebarItems: SidebarItem[] = [
  { id: 'interfaces', label: 'Interfaces', children: [
    { id: 'ethernet', label: 'Ethernet' },
    { id: 'loopback', label: 'Loopback' },
    { id: 'tunnel', label: 'Tunnel' },
    { id: 'vlan', label: 'VLAN' },
  ]},
  { id: 'zones', label: 'Zones' },
  { id: 'vlans', label: 'VLANs' },
  { id: 'virtual-wires', label: 'Virtual Wires' },
  { id: 'virtual-routers', label: 'Virtual Routers' },
  { id: 'ipsec-tunnels', label: 'IPSec Tunnels' },
  { id: 'ike-gateways', label: 'IKE Gateways' },
  { id: 'ike-crypto', label: 'IKE Crypto' },
  { id: 'ipsec-crypto', label: 'IPSec Crypto' },
  { id: 'gre-tunnels', label: 'GRE Tunnels' },
  { id: 'qos', label: 'QoS' },
  { id: 'lldp', label: 'LLDP' },
  { id: 'dhcp', label: 'DHCP' },
  { id: 'dns-proxy', label: 'DNS Proxy' },
  { id: 'globalprotect', label: 'GlobalProtect', children: [
    { id: 'gp-portals', label: 'Portals' },
    { id: 'gp-gateways', label: 'Gateways' },
    { id: 'gp-mdm', label: 'MDM' },
  ]},
  { id: 'network-profiles', label: 'Network Profiles', children: [
    { id: 'interface-mgmt', label: 'Interface Mgmt' },
    { id: 'zone-protection', label: 'Zone Protection' },
    { id: 'monitor-profile', label: 'Monitor' },
    { id: 'decryption-np', label: 'Decryption Profile' },
  ]},
];

export const NetworkPage = () => {
  const { interfaces, zones, staticRoutes, updateInterface, addZone, updateZone, deleteZone, addStaticRoute, deleteStaticRoute } = useFirewall();
  const [activeSidebar, setActiveSidebar] = useState('ethernet');
  const [editingInterface, setEditingInterface] = useState<FirewallInterface | null>(null);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [showAddZone, setShowAddZone] = useState(false);
  const [editingRoute, setEditingRoute] = useState<StaticRoute | null>(null);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [zoneForm, setZoneForm] = useState<Zone>({ name: '', type: 'Layer3', interfaces: [], zoneProtectionProfile: '', logSetting: 'default', enableUserIdentification: false });
  const [routeForm, setRouteForm] = useState<StaticRoute>({ name: '', destination: '', nextHop: '', interface: '', metric: 10, virtualRouter: 'default' });
  const [ifaceForm, setIfaceForm] = useState<Partial<FirewallInterface>>({});

  const renderContent = () => {
    if (activeSidebar === 'ethernet' || activeSidebar === 'interfaces') {
      return (
        <div className="p-3 space-y-2">
          <div className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Ethernet Interfaces</div>
          <PanTable<FirewallInterface>
            columns={[
              { key: 'name', label: 'Interface', width: '130px' },
              { key: 'type', label: 'Interface Type', width: '100px' },
              { key: 'zone', label: 'Security Zone', width: '100px', render: r => r.zone || <span style={{ color: 'hsl(215, 10%, 65%)' }}>None</span> },
              { key: 'ipAddress', label: 'IP Address', width: '140px', render: r => r.ipAddress || <span style={{ color: 'hsl(215, 10%, 65%)' }}>N/A</span> },
              { key: 'virtualRouter', label: 'Virtual Router', width: '110px' },
              { key: 'linkState', label: 'Link State', width: '80px', render: r => (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ background: r.linkState === 'up' ? 'hsl(100, 55%, 53%)' : 'hsl(0, 0%, 70%)' }} />
                  {r.linkState}
                </span>
              )},
              { key: 'comment', label: 'Comment' },
            ]}
            data={interfaces}
            rowKey={r => r.name}
            onRowDoubleClick={r => { setEditingInterface(r); setIfaceForm(r); }}
          />
        </div>
      );
    }
    if (activeSidebar === 'zones') {
      return (
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Security Zones</span>
            <button onClick={() => { setZoneForm({ name: '', type: 'Layer3', interfaces: [], zoneProtectionProfile: '', logSetting: 'default', enableUserIdentification: false }); setShowAddZone(true); }}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                    style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <PanTable<Zone>
            columns={[
              { key: 'name', label: 'Name', width: '120px' },
              { key: 'type', label: 'Type', width: '100px' },
              { key: 'interfaces', label: 'Interfaces', render: r => r.interfaces.join(', ') },
              { key: 'zoneProtectionProfile', label: 'Zone Protection', width: '160px' },
              { key: 'enableUserIdentification', label: 'User-ID', width: '60px', render: r => r.enableUserIdentification ? '✓' : '' },
              { key: 'actions', label: '', width: '60px', render: r => (
                <div className="flex gap-1">
                  <button onClick={() => { setEditingZone(r); setZoneForm(r); }}><Pencil className="w-3 h-3" style={{ color: 'hsl(207, 80%, 52%)' }} /></button>
                  <button onClick={() => deleteZone(r.name)}><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
                </div>
              )},
            ]}
            data={zones}
            rowKey={r => r.name}
            onRowDoubleClick={r => { setEditingZone(r); setZoneForm(r); }}
          />
        </div>
      );
    }
    if (activeSidebar === 'virtual-routers') {
      return (
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold" style={{ color: 'hsl(215, 25%, 15%)' }}>Virtual Router: default — Static Routes</span>
            <button onClick={() => { setRouteForm({ name: '', destination: '', nextHop: '', interface: '', metric: 10, virtualRouter: 'default' }); setShowAddRoute(true); }}
                    className="flex items-center gap-1 px-2 py-1 text-[11px] rounded"
                    style={{ background: 'hsl(100, 55%, 53%)', color: 'hsl(0, 0%, 100%)' }}>
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <PanTable<StaticRoute>
            columns={[
              { key: 'name', label: 'Name', width: '130px' },
              { key: 'destination', label: 'Destination', width: '140px' },
              { key: 'nextHop', label: 'Next Hop', width: '140px', render: r => r.nextHop || 'None' },
              { key: 'interface', label: 'Interface', width: '120px' },
              { key: 'metric', label: 'Metric', width: '70px' },
              { key: 'actions', label: '', width: '40px', render: r => (
                <button onClick={() => deleteStaticRoute(r.name)}><Trash2 className="w-3 h-3" style={{ color: 'hsl(0, 72%, 51%)' }} /></button>
              )},
            ]}
            data={staticRoutes}
            rowKey={r => r.name}
            onRowDoubleClick={r => { setEditingRoute(r); setRouteForm(r); }}
          />
        </div>
      );
    }
    return (
      <div className="p-8 text-center text-[12px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
        Select an item from the sidebar to configure.
      </div>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <PanSidebar items={sidebarItems} activeItem={activeSidebar} onItemClick={setActiveSidebar} />
      <div className="flex-1 overflow-auto panos-scrollbar">{renderContent()}</div>

      {editingInterface && (
        <PanModal title={`Ethernet Interface — ${editingInterface.name}`} width="550px"
                  onClose={() => setEditingInterface(null)}
                  onSave={() => { updateInterface(editingInterface.name, ifaceForm); setEditingInterface(null); }}>
          <PanTabs tabs={[
            { id: 'config', label: 'Config', content: (
              <div className="space-y-1">
                <PanFormField label="Interface Type"><PanSelect value={ifaceForm.type || 'Layer3'} onChange={v => setIfaceForm(f => ({ ...f, type: v as FirewallInterface['type'] }))} options={[{ value: 'Layer3', label: 'Layer3' }, { value: 'Layer2', label: 'Layer2' }, { value: 'Virtual Wire', label: 'Virtual Wire' }, { value: 'Tap', label: 'Tap' }]} /></PanFormField>
                <PanFormField label="Virtual Router"><PanSelect value={ifaceForm.virtualRouter || ''} onChange={v => setIfaceForm(f => ({ ...f, virtualRouter: v }))} options={[{ value: '', label: 'None' }, { value: 'default', label: 'default' }]} /></PanFormField>
                <PanFormField label="Security Zone"><PanSelect value={ifaceForm.zone || ''} onChange={v => setIfaceForm(f => ({ ...f, zone: v }))} options={[{ value: '', label: 'None' }, { value: 'trust', label: 'trust' }, { value: 'untrust', label: 'untrust' }, { value: 'dmz', label: 'dmz' }]} /></PanFormField>
              </div>
            )},
            { id: 'ipv4', label: 'IPv4', content: (
              <div className="space-y-1">
                <PanFormField label="IP Address"><PanInput value={ifaceForm.ipAddress || ''} onChange={v => setIfaceForm(f => ({ ...f, ipAddress: v }))} placeholder="x.x.x.x/mask" /></PanFormField>
              </div>
            )},
            { id: 'ipv6', label: 'IPv6', content: (
              <div className="p-3 text-[11px]" style={{ color: 'hsl(215, 10%, 45%)' }}>
                IPv6 is not configured on this interface. Enable IPv6 to configure addresses.
              </div>
            )},
            { id: 'advanced', label: 'Advanced', content: (
              <div className="space-y-1">
                <PanFormField label="Link Speed"><PanInput value={ifaceForm.speed || ''} onChange={v => setIfaceForm(f => ({ ...f, speed: v }))} /></PanFormField>
                <PanFormField label="MTU"><PanInput value={String(ifaceForm.mtu || 1500)} onChange={v => setIfaceForm(f => ({ ...f, mtu: parseInt(v) || 1500 }))} type="number" /></PanFormField>
                <PanFormField label="Management Profile"><PanSelect value={ifaceForm.managementProfile || ''} onChange={v => setIfaceForm(f => ({ ...f, managementProfile: v }))} options={[{ value: '', label: 'None' }, { value: 'allow-ping', label: 'allow-ping' }, { value: 'allow-https', label: 'allow-https' }, { value: 'allow-ssh', label: 'allow-ssh' }]} /></PanFormField>
                <PanFormField label="Comment"><PanInput value={ifaceForm.comment || ''} onChange={v => setIfaceForm(f => ({ ...f, comment: v }))} /></PanFormField>
              </div>
            )},
          ]} />
        </PanModal>
      )}

      {(showAddZone || editingZone) && (
        <PanModal title={editingZone ? `Edit Zone — ${editingZone.name}` : 'Add Zone'} width="450px"
                  onClose={() => { setShowAddZone(false); setEditingZone(null); }}
                  onSave={() => {
                    if (editingZone) updateZone(editingZone.name, zoneForm);
                    else addZone(zoneForm);
                    setShowAddZone(false); setEditingZone(null);
                  }}>
          <div className="space-y-1">
            <PanFormField label="Name" required><PanInput value={zoneForm.name} onChange={v => setZoneForm(f => ({ ...f, name: v }))} disabled={!!editingZone} /></PanFormField>
            <PanFormField label="Type"><PanSelect value={zoneForm.type} onChange={v => setZoneForm(f => ({ ...f, type: v as Zone['type'] }))} options={[{ value: 'Layer3', label: 'Layer3' }, { value: 'Layer2', label: 'Layer2' }, { value: 'Virtual Wire', label: 'Virtual Wire' }]} /></PanFormField>
            <PanFormField label="Zone Protection"><PanInput value={zoneForm.zoneProtectionProfile} onChange={v => setZoneForm(f => ({ ...f, zoneProtectionProfile: v }))} /></PanFormField>
            <PanFormField label="Enable User Identification">
              <label className="flex items-center gap-1 text-[11px]"><input type="checkbox" checked={zoneForm.enableUserIdentification} onChange={e => setZoneForm(f => ({ ...f, enableUserIdentification: e.target.checked }))} /> Enable</label>
            </PanFormField>
          </div>
        </PanModal>
      )}

      {(showAddRoute || editingRoute) && (
        <PanModal title={editingRoute ? `Edit Route — ${editingRoute.name}` : 'Add Static Route'} width="450px"
                  onClose={() => { setShowAddRoute(false); setEditingRoute(null); }}
                  onSave={() => {
                    if (editingRoute) { /* close */ }
                    else addStaticRoute(routeForm);
                    setShowAddRoute(false); setEditingRoute(null);
                  }}>
          <div className="space-y-1">
            <PanFormField label="Name" required><PanInput value={routeForm.name} onChange={v => setRouteForm(f => ({ ...f, name: v }))} /></PanFormField>
            <PanFormField label="Destination" required><PanInput value={routeForm.destination} onChange={v => setRouteForm(f => ({ ...f, destination: v }))} placeholder="0.0.0.0/0" /></PanFormField>
            <PanFormField label="Next Hop"><PanInput value={routeForm.nextHop} onChange={v => setRouteForm(f => ({ ...f, nextHop: v }))} /></PanFormField>
            <PanFormField label="Interface"><PanSelect value={routeForm.interface} onChange={v => setRouteForm(f => ({ ...f, interface: v }))} options={[{ value: '', label: 'None' }, ...interfaces.map(i => ({ value: i.name, label: i.name }))]} /></PanFormField>
            <PanFormField label="Metric"><PanInput value={String(routeForm.metric)} onChange={v => setRouteForm(f => ({ ...f, metric: parseInt(v) || 10 }))} type="number" /></PanFormField>
          </div>
        </PanModal>
      )}
    </div>
  );
};
