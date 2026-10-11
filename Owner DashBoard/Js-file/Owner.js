import { Map as MapLibreMap, Marker } from '../../node_modules/maplibre-gl/dist/maplibre-gl.mjs';

const profileButton = document.getElementById('profileButton');
const profileMenu = document.getElementById('profileMenu');
const notificationButton = document.getElementById('notificationButton');
const navItems = document.querySelectorAll('.nav-item');
const dashboardViews = document.querySelectorAll('.dashboard-view');
const ceoGrid = document.getElementById('ceoGrid');
const ceoCount = document.getElementById('ceoCount');
const ceoEmptyState = document.getElementById('ceoEmptyState');
const ceoSectionNotice = document.getElementById('ceoSectionNotice');
const ceoDialog = document.getElementById('ceoDialog');
const ceoForm = document.getElementById('ceoForm');
const ceoFormError = document.getElementById('ceoFormError');
const ceoFilterButton = document.getElementById('ceoFilterButton');
const ceoFilterRow = document.getElementById('ceoFilterRow');
const ceoSearch = document.getElementById('ceoSearch');
const ceoMetrics = [
  { label: 'Performance', value: 89 },
  { label: 'Customers rate', value: 62 },
  { label: 'Activity', value: 79 },
  { label: 'Accuracy', value: 99 }
];
const profileTypes = {
  Admins: { key: 'admins', singular: 'Admin', plural: 'Admins' },
  'Customer supports': { key: 'supports', singular: 'Support profile', plural: 'Support profiles' },
  'Government sector': { key: 'government', singular: 'Government profile', plural: 'Government profiles' }
};
const defaultAdminRecords = [
  {
    id: 'admin-yared-desta',
    name: 'Yared Desta',
    phone: '+251900000001',
    profile: '../...icons/Owner%20D.Board/p%201%20icon.png',
    isDefault: true
  },
  {
    id: 'admin-mehari-gidey',
    name: 'Mehari Gidey',
    phone: '+251900000002',
    profile: '../...icons/Owner%20D.Board/p%202%20icon.png',
    isDefault: true
  },
  {
    id: 'admin-muse-gere',
    name: 'Muse Gere',
    phone: '+251900000003',
    profile: '../...icons/Owner%20D.Board/P%203%20icon.png',
    isDefault: true
  }
];
const defaultSupportRecords = [
  {
    id: 'support-yared-desta',
    name: 'Yared Desta',
    phone: '+251900000001',
    profile: '../...icons/Owner%20D.Board/p%201%20icon.png',
    isDefault: true
  },
  {
    id: 'support-mehari-gidey',
    name: 'Mehari Gidey',
    phone: '+251900000002',
    profile: '../...icons/Owner%20D.Board/p%202%20icon.png',
    isDefault: true
  },
  {
    id: 'support-muse-gere',
    name: 'Muse Gere',
    phone: '+251900000003',
    profile: '../...icons/Owner%20D.Board/P%203%20icon.png',
    isDefault: true
  }
];
const defaultProfiles = {
  Admins: defaultAdminRecords,
  'Customer supports': defaultSupportRecords
};
const managedProfiles = {};
let activeProfileType = 'CEO';

Object.entries(profileTypes).forEach(([section, config]) => {
  try {
    const storedProfiles = JSON.parse(localStorage.getItem(`owner-${config.key}-profiles`) || '[]');
    const profiles = Array.isArray(storedProfiles) ? storedProfiles : [];
    const defaults = defaultProfiles[section] || [];
    if (defaults.length) {
      const defaultPhones = new Set(defaults.map((record) => record.phone.replace(/\D/g, '')));
      managedProfiles[section] = [
        ...defaults,
        ...profiles.filter((record) => !defaultPhones.has(record.phone?.replace(/\D/g, '')))
      ];
    } else {
      managedProfiles[section] = profiles;
    }
  } catch {
    managedProfiles[section] = [...(defaultProfiles[section] || [])];
  }
});

let ceoRecords = [];
const defaultCeoRecords = [
  {
    id: 'ceo-yared-desta',
    name: 'Yared Desta',
    phone: '+251900000001',
    profile: '../...icons/Owner%20D.Board/p%201%20icon.png',
    isDefault: true
  },
  {
    id: 'ceo-mehari-gidey',
    name: 'Mehari Gidey',
    phone: '+251900000002',
    profile: '../...icons/Owner%20D.Board/p%202%20icon.png',
    isDefault: true
  },
  {
    id: 'ceo-muse-gere',
    name: 'Muse Gere',
    phone: '+251900000003',
    profile: '../...icons/Owner%20D.Board/P%203%20icon.png',
    isDefault: true
  }
];

try {
  const savedRecords = JSON.parse(localStorage.getItem('owner-ceo-records') || '[]');
  if (Array.isArray(savedRecords)) {
    const defaultPhones = new Set(defaultCeoRecords.map((record) => record.phone.replace(/\D/g, '')));
    ceoRecords = [
      ...defaultCeoRecords,
      ...savedRecords.filter((record) => !defaultPhones.has(record.phone?.replace(/\D/g, '')))
    ];
  }
} catch {
  ceoRecords = [...defaultCeoRecords];
}

if (profileButton && profileMenu) {
  profileButton.addEventListener('click', () => {
    const isOpen = profileMenu.classList.toggle('open');
    profileButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
      profileMenu.classList.remove('open');
      profileButton.setAttribute('aria-expanded', 'false');
    }
  });
}

if (notificationButton) {
  notificationButton.addEventListener('click', () => {
    notificationButton.setAttribute('aria-label', 'No new notifications');
    notificationButton.querySelector('.notification-dot')?.remove();
  });
}

navItems.forEach((item) => {
  item.addEventListener('click', () => {
    const selectedView = Array.from(dashboardViews).find((view) => view.dataset.view === item.dataset.section);
    if (!selectedView) return;

    if (ceoSectionNotice) ceoSectionNotice.textContent = '';
    navItems.forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
    dashboardViews.forEach((view) => {
      view.hidden = view !== selectedView;
      view.classList.toggle('active', view === selectedView);
    });
    if (selectedView.dataset.view === 'All locations') {
      requestAnimationFrame(initializeLocationMap);
    }
  });
});

function saveCeoRecords() {
  localStorage.setItem('owner-ceo-records', JSON.stringify(ceoRecords));
}

function createMetricGrid() {
  const metrics = document.createElement('div');
  metrics.className = 'ceo-metrics';

  ceoMetrics.forEach((item) => {
    const metric = document.createElement('div');
    metric.className = 'ceo-metric';

    const ring = document.createElement('div');
    ring.className = 'metric-ring';
    ring.style.setProperty('--metric-value', `${item.value}%`);
    ring.setAttribute('role', 'img');
    ring.setAttribute('aria-label', `${item.label}: ${item.value}%`);
    ring.tabIndex = 0;

    const value = document.createElement('span');
    value.textContent = `${item.value}%`;
    ring.append(value);

    const label = document.createElement('span');
    label.className = 'metric-label';
    label.textContent = item.label;
    metric.append(ring, label);
    metrics.append(metric);
  });

  return metrics;
}

function renderCeoRecords() {
  const query = ceoSearch?.value.trim().toLocaleLowerCase() || '';
  const filteredRecords = ceoRecords.filter((record) =>
    `${record.name} ${record.phone}`.toLocaleLowerCase().includes(query)
  );

  ceoGrid.replaceChildren();
  ceoCount.textContent = `${ceoRecords.length} ${ceoRecords.length === 1 ? 'CEO' : 'CEOs'}`;
  ceoEmptyState.hidden = filteredRecords.length > 0;

  if (ceoRecords.length === 0) {
    ceoEmptyState.textContent = 'No CEOs added yet. Select “Add CEO” to create the first profile.';
  } else if (filteredRecords.length === 0) {
    ceoEmptyState.textContent = 'No CEOs match this search.';
  }

  filteredRecords.forEach((record) => {
    const card = document.createElement('article');
    card.className = 'ceo-card';
    card.setAttribute('aria-label', `${record.name}, ${record.phone}`);

    const cardHeader = document.createElement('div');
    cardHeader.className = 'ceo-card-header';
    const avatar = document.createElement(record.profile ? 'img' : 'span');
    avatar.className = 'ceo-avatar';
    if (record.profile) {
      avatar.src = record.profile;
      avatar.alt = `${record.name} profile`;
    } else {
      avatar.textContent = record.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    }

    const removeButton = document.createElement('button');
    removeButton.className = 'more-button';
    removeButton.type = 'button';
    removeButton.setAttribute('aria-label', `Remove ${record.name}`);
    removeButton.textContent = '•••';
    removeButton.disabled = Boolean(record.isDefault);
    if (record.isDefault) removeButton.title = 'Default CEO profiles cannot be removed';
    removeButton.addEventListener('click', () => {
      ceoRecords = ceoRecords.filter((entry) => entry.id !== record.id);
      saveCeoRecords();
      renderCeoRecords();
      ceoSectionNotice.textContent = `${record.name} was removed.`;
    });
    const name = document.createElement('h3');
    name.className = 'ceo-card-name';
    name.textContent = record.name;
    cardHeader.append(avatar, name, removeButton);

    card.append(cardHeader, createMetricGrid());
    ceoGrid.append(card);
  });
}

function renderManagedProfiles(section) {
  const config = profileTypes[section];
  const key = config.key;
  const records = managedProfiles[section];
  const grid = document.getElementById(`${key}Grid`);
  const count = document.getElementById(`${key}Count`);
  const emptyState = document.getElementById(`${key}EmptyState`);
  const search = document.getElementById(`${key}Search`);
  const query = search.value.trim().toLocaleLowerCase();
  const matchingRecords = records.filter((record) =>
    `${record.name} ${record.phone}`.toLocaleLowerCase().includes(query)
  );

  count.textContent = `${records.length} ${records.length === 1 ? config.singular : config.plural}`;
  grid.replaceChildren();
  emptyState.hidden = matchingRecords.length > 0;
  emptyState.textContent = records.length && !matchingRecords.length
    ? `No ${config.plural.toLocaleLowerCase()} match this search.`
    : `No ${config.plural.toLocaleLowerCase()} added yet.`;

  matchingRecords.forEach((record) => {
    const card = document.createElement('article');
    card.className = 'ceo-card';
    card.setAttribute('aria-label', `${record.name}, ${record.phone}`);

    const header = document.createElement('div');
    header.className = 'ceo-card-header';
    const avatar = document.createElement(record.profile ? 'img' : 'span');
    avatar.className = 'ceo-avatar';
    if (record.profile) {
      avatar.src = record.profile;
      avatar.alt = `${record.name} profile`;
    } else {
      avatar.textContent = record.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    }

    const name = document.createElement('h3');
    name.className = 'ceo-card-name';
    name.textContent = record.name;

    const removeButton = document.createElement('button');
    removeButton.className = 'more-button';
    removeButton.type = 'button';
    removeButton.textContent = '•••';
    removeButton.setAttribute('aria-label', `Remove ${record.name}`);
    removeButton.disabled = Boolean(record.isDefault);
    if (record.isDefault) removeButton.title = `Default ${section === 'Admins' ? 'Admin' : 'Customer Support'} profiles cannot be removed`;
    removeButton.addEventListener('click', () => {
      managedProfiles[section] = managedProfiles[section].filter((item) => item.id !== record.id);
      localStorage.setItem(`owner-${key}-profiles`, JSON.stringify(managedProfiles[section]));
      renderManagedProfiles(section);
      document.getElementById(`${key}Notice`).textContent = `${record.name} was removed.`;
    });

    header.append(avatar, name, removeButton);
    card.append(header, createMetricGrid());
    grid.append(card);
  });
}

function openProfileDialog(section) {
  activeProfileType = section;
  const title = section === 'CEO' ? 'CEO' : profileTypes[section].singular;
  document.getElementById('ceoDialogTitle').textContent = `Add ${title}`;
  document.getElementById('ceoDialogDescription').textContent = `Create a ${title.toLocaleLowerCase()} profile for your organization.`;
  document.getElementById('profileSubmitButton').textContent = `Save ${title}`;
  document.getElementById('ceoFormError').textContent = '';
  ceoDialog.showModal();
  document.getElementById('ceoName').focus();
}

document.getElementById('addCeoButton')?.addEventListener('click', () => {
  openProfileDialog('CEO');
});

document.querySelectorAll('[data-add-profile]').forEach((button) => {
  button.addEventListener('click', () => openProfileDialog(button.dataset.addProfile));
});

document.getElementById('closeCeoDialog')?.addEventListener('click', () => ceoDialog.close());

ceoForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(ceoForm);
  const name = formData.get('name').toString().trim();
  const phone = formData.get('phone').toString().trim();
  const normalizedPhone = phone.replace(/\D/g, '');
  const activeRecords = activeProfileType === 'CEO' ? ceoRecords : managedProfiles[activeProfileType];
  const alreadyExists = activeRecords.some((record) => record.phone.replace(/\D/g, '') === normalizedPhone);

  if (alreadyExists) {
    const roleName = activeProfileType === 'CEO' ? 'CEO' : profileTypes[activeProfileType].singular;
    ceoFormError.textContent = `A ${roleName.toLocaleLowerCase()} with this phone number already exists.`;
    return;
  }

  const newRecord = { id: crypto.randomUUID(), name, phone };
  if (activeProfileType === 'CEO') {
    ceoRecords.push(newRecord);
    saveCeoRecords();
    renderCeoRecords();
  } else {
    const config = profileTypes[activeProfileType];
    managedProfiles[activeProfileType].push(newRecord);
    localStorage.setItem(`owner-${config.key}-profiles`, JSON.stringify(managedProfiles[activeProfileType]));
    renderManagedProfiles(activeProfileType);
  }
  ceoForm.reset();
  ceoDialog.close();
  const noticeId = activeProfileType === 'CEO' ? 'ceoSectionNotice' : `${profileTypes[activeProfileType].key}Notice`;
  document.getElementById(noticeId).textContent = `${name} was added.`;
});

ceoFilterButton?.addEventListener('click', () => {
  ceoFilterRow.hidden = !ceoFilterRow.hidden;
  ceoFilterButton.setAttribute('aria-expanded', String(!ceoFilterRow.hidden));
  if (!ceoFilterRow.hidden) ceoSearch.focus();
});

ceoSearch?.addEventListener('input', renderCeoRecords);

renderCeoRecords();

Object.keys(profileTypes).forEach((section) => {
  const key = profileTypes[section].key;
  document.getElementById(`${key}FilterButton`).addEventListener('click', (event) => {
    const filterRow = document.getElementById(`${key}FilterRow`);
    filterRow.hidden = !filterRow.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!filterRow.hidden));
    if (!filterRow.hidden) document.getElementById(`${key}Search`).focus();
  });
  document.getElementById(`${key}Search`).addEventListener('input', () => renderManagedProfiles(section));
  renderManagedProfiles(section);
});

const locationRecords = [
  { id: 'shop-ali-1', name: 'Ali Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001210', image: 'Ellipse%2058.png', x: 63, y: 33 },
  { id: 'shop-aster-1', name: 'Aster Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001211', image: 'Ellipse%2060.png', x: 46, y: 45 },
  { id: 'shop-joun-1', name: 'Joun Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001212', image: 'Ellipse%2057.png', x: 70, y: 54 },
  { id: 'shop-ali-2', name: 'Ali Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001213', image: 'Ellipse%2061.png', x: 38, y: 62 },
  { id: 'shop-aster-2', name: 'Aster Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001214', image: 'Ellipse%2062.png', x: 57, y: 73 },
  { id: 'shop-joun-2', name: 'Joun Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001215', image: 'Ellipse%2064.png', x: 79, y: 42 },
  { id: 'shop-joun-3', name: 'Joun Shop', category: 'Small Shops', phone: '+251900000000', recordId: '0209001216', image: 'Ellipse%2063.png', x: 27, y: 50 },
  { id: 'bank-awash', name: 'Awash Bank', category: 'Banks', phone: '+251911000001', recordId: '0209001301', image: 'Ellipse%2065.png', x: 34, y: 38 },
  { id: 'coffee-buna', name: 'Buna Coffee House', category: 'Coffee Houses', phone: '+251911000002', recordId: '0209001302', image: 'Ellipse%2066.png', x: 52, y: 58 },
  { id: 'burger-joun', name: 'Joun Burger House', category: 'Burger Houses', phone: '+251911000003', recordId: '0209001303', image: 'Ellipse%2067.png', x: 73, y: 64 },
  { id: 'pizza-ali', name: 'Ali Pizza House', category: 'Pizza Houses', phone: '+251911000004', recordId: '0209001304', image: 'Ellipse%2068.png', x: 44, y: 27 },
  { id: 'fitness-bole', name: 'Bole Fitness House', category: 'Fitness Houses', phone: '+251911000005', recordId: '0209001305', image: 'Ellipse%2069.png', x: 62, y: 47 },
  { id: 'furniture-walia', name: 'Walia Furniture House', category: 'Furniture Houses', phone: '+251911000006', recordId: '0209001306', image: 'Ellipse%2070.png', x: 28, y: 70 },
  { id: 'realty-bole', name: 'Bole Realist House', category: 'Realist Houses', phone: '+251911000007', recordId: '0209001307', image: 'Ellipse%2070%20(1).png', x: 81, y: 29 },
  { id: 'electronics-ethio', name: 'Ethio Electronic House', category: 'Electronic Houses', phone: '+251911000008', recordId: '0209001308', image: 'Ellipse%2059.png', x: 55, y: 80 }
];

const locationList = document.getElementById('locationList');
const locationEmpty = document.getElementById('locationEmpty');
const locationSearch = document.getElementById('locationSearch');
const locationSearchForm = document.getElementById('locationSearchForm');
const categoryFilters = document.querySelectorAll('.category-filter');
const locationMapElement = document.getElementById('locationMap');
const mapStatus = document.getElementById('mapStatus');
const mapPhone = document.getElementById('mapPhone');
let activeLocationCategory = 'Small Shops';
let selectedLocation = locationRecords[0];
let locationMap = null;
let locationMarker = null;

function getLocationCoordinates(location) {
  return [
    38.7578 + (location.x - 50) * 0.00035,
    8.9806 + (50 - location.y) * 0.0003
  ];
}

function initializeLocationMap() {
  if (locationMap) {
    locationMap.resize();
    return;
  }

  locationMap = new MapLibreMap({
    container: locationMapElement,
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: getLocationCoordinates(selectedLocation),
    zoom: 12.5,
    attributionControl: false
  });

  const markerElement = document.createElement('div');
  markerElement.className = 'map-marker';
  markerElement.setAttribute('aria-hidden', 'true');
  locationMarker = new Marker({ element: markerElement, anchor: 'bottom' })
    .setLngLat(getLocationCoordinates(selectedLocation))
    .addTo(locationMap);

  locationMap.once('load', () => {
    mapStatus.hidden = true;
    locationMap.resize();
  });

  locationMap.on('error', () => {
    if (!locationMap.loaded()) {
      mapStatus.textContent = 'OpenFreeMap is unavailable. Check your internet connection.';
    }
  });
}

function selectLocation(location, row) {
  const changedLocation = selectedLocation.id !== location.id;
  selectedLocation = location;
  locationList.querySelectorAll('.location-row').forEach((item) => item.classList.remove('selected'));
  row.classList.add('selected');
  const coordinates = getLocationCoordinates(location);
  locationMarker?.setLngLat(coordinates);
  if (changedLocation && locationMap?.loaded()) {
    locationMap.flyTo({ center: coordinates, zoom: Math.max(12.5, locationMap.getZoom()), duration: 450 });
  }
  mapPhone.href = `tel:${location.phone}`;
  mapPhone.setAttribute('aria-label', `Call ${location.name} at ${location.phone}`);
}

function renderLocations() {
  const query = locationSearch.value.trim().toLocaleLowerCase();
  const filteredLocations = locationRecords.filter((location) =>
    location.category === activeLocationCategory &&
    `${location.name} ${location.recordId} ${location.phone}`.toLocaleLowerCase().includes(query)
  );

  locationList.replaceChildren();
  locationEmpty.hidden = filteredLocations.length > 0;

  filteredLocations.forEach((location) => {
    const row = document.createElement('button');
    row.className = 'location-row';
    row.type = 'button';
    row.dataset.locationId = location.id;
    row.classList.toggle('selected', location.id === selectedLocation.id);
    row.setAttribute('aria-label', `${location.name}, ID ${location.recordId}, Phone ${location.phone}`);

    const image = document.createElement('img');
    image.src = `../../All%20location%20Page/icons/${location.image}`;
    image.alt = '';

    const details = document.createElement('span');
    details.className = 'location-details';
    const name = document.createElement('span');
    name.className = 'location-name';
    name.textContent = location.name;
    const metadata = document.createElement('span');
    metadata.className = 'location-metadata';
    metadata.textContent = `ID: ${location.recordId}  Phone: ${location.phone}`;
    details.append(name, metadata);
    row.append(image, details);
    row.addEventListener('click', () => selectLocation(location, row));
    locationList.append(row);
  });

  if (filteredLocations.length) {
    const currentLocation = filteredLocations.find((location) => location.id === selectedLocation.id) || filteredLocations[0];
    const currentRow = locationList.querySelector(`[data-location-id="${currentLocation.id}"]`);
    selectLocation(currentLocation, currentRow);
  }
}

categoryFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    activeLocationCategory = filter.dataset.category;
    categoryFilters.forEach((item) => {
      const isActive = item === filter;
      item.classList.toggle('active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    renderLocations();
  });
});

locationSearch.addEventListener('input', renderLocations);
locationSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderLocations();
});

document.getElementById('mapZoomIn').addEventListener('click', () => {
  locationMap?.zoomIn();
});

document.getElementById('mapZoomOut').addEventListener('click', () => {
  locationMap?.zoomOut();
});

renderLocations();
