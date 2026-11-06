// Initialize Charts when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
});

let trmsChartInstance = null;
let aeroChartInstance = null;

function initCharts() {
    // 1. TRMS Control Chart (Real Simulink Data Integration)
    const ctxTrms = document.getElementById('trmsChart').getContext('2d');
    trmsChartInstance = new Chart(ctxTrms, {
        type: 'line',
        data: {
            labels: ['0s', '5s', '10s', '15s', '30s', '45s', '60s'],
            datasets: [
                {
                    label: 'Pitch Axis Response (rad)',
                    data: [0, 0.60, 0.31, 0.44, 0.40, 0.40, 0.40], // Baseline PID peak overshoot data
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Target Set-Point (0.4 rad)',
                    data: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
                    borderColor: '#38bdf8',
                    borderWidth: 1.5,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                    ticks: { color: '#94a3b8' },
                    min: 0,
                    max: 0.7
                },
                x: { 
                    grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                    ticks: { color: '#94a3b8' } 
                }
            }
        }
    });

    // 2. Aerodynamic Wing Lift Curve Chart
    const ctxAero = document.getElementById('aeroChart').getContext('2d');
    aeroChartInstance = new Chart(ctxAero, {
        type: 'line',
        data: {
            labels: ['-2°', '0°', '4°', '8°', '12°', '16° (Stall)'],
            datasets: [{
                label: 'Lift Coefficient (CL)',
                data: [-0.2, 0.1, 0.5, 0.9, 1.3, 0.95],
                borderColor: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                borderWidth: 2,
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
                x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
            }
        }
    });
}

// Controller Simulation Switcher Logic (Updated with Real Project Performance Stats)
function switchControlSim(type) {
    const btnPd = document.getElementById('btn-pd');
    const btnFnn = document.getElementById('btn-fnn');
    const statSettling = document.getElementById('stat-settling');
    const statOvershoot = document.getElementById('stat-overshoot');
    const statDamping = document.getElementById('stat-damping');

    if (type === 'pd') {
        // Highlight Baseline PID Button
        btnPd.className = "w-full text-left p-4 rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 transition-all font-mono text-xs";
        btnFnn.className = "w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all font-mono text-xs";
        
        // Update Stats to Real PID Values
        statOvershoot.textContent = "Peak 0.60 rad (50%)";
        statSettling.textContent = "45.0 seconds";
        if (statDamping) statDamping.textContent = "Underdamped";

        // Update Chart Dataset for PID
        trmsChartInstance.data.datasets[0].data = [0, 0.60, 0.31, 0.44, 0.40, 0.40, 0.40];
        trmsChartInstance.data.datasets[0].borderColor = '#f59e0b';
        trmsChartInstance.data.datasets[0].backgroundColor = 'rgba(245, 158, 11, 0.1)';
        trmsChartInstance.update();
    } else {
        // Highlight Optimised FNN Button
        btnFnn.className = "w-full text-left p-4 rounded-xl border border-brand-500/30 bg-brand-500/20 text-brand-400 transition-all font-mono text-xs";
        btnPd.className = "w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all font-mono text-xs";
        
        // Update Stats to Real Optimised FNN Values
        statOvershoot.textContent = "0% (Eliminated)";
        statSettling.textContent = "~10.0 seconds";
        if (statDamping) statDamping.textContent = "Critically Damped";

        // Update Chart Dataset for FNN
        trmsChartInstance.data.datasets[0].data = [0, 0.30, 0.38, 0.40, 0.40, 0.40, 0.40];
        trmsChartInstance.data.datasets[0].borderColor = '#38bdf8';
        trmsChartInstance.data.datasets[0].backgroundColor = 'rgba(56, 189, 248, 0.1)';
        trmsChartInstance.update();
    }
}

// Modal Handlers
function openCvModal() {
    document.getElementById('cvModal').classList.remove('hidden');
}

function closeCvModal() {
    document.getElementById('cvModal').classList.add('hidden');
}

function handleFormSubmit(event) {
    event.preventDefault();
    document.getElementById('contactForm').reset();
    document.getElementById('formSuccess').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('formSuccess').classList.add('hidden');
    }, 5000);
}



// ==========================================
// 1. TRMS CHART & CONTROLLER SWITCHER LOGIC
// ==========================================
let trmsChartInstance = null;

function initTRMSChart() {
  const canvasElement = document.getElementById('trmsChart');
  if (!canvasElement) return; // Prevents errors if canvas isn't on the current view
  
  const ctx = canvasElement.getContext('2d');
  
  const timeLabels = ['0s', '5s', '10s', '15s', '20s', '25s', '30s', '35s', '40s', '45s'];
  const pdData     = [0.0, 0.4, 0.6, 0.45, 0.32, 0.28, 0.25, 0.22, 0.21, 0.20]; 
  const fnnData    = [0.0, 0.15, 0.19, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20]; 

  trmsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: 'Baseline PD Response',
        data: pdData,
        borderColor: '#f59e0b', 
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' } },
        y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b' }, min: 0, max: 0.7 }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function switchControlSim(type) {
  const btnPd = document.getElementById('btn-pd');
  const btnFnn = document.getElementById('btn-fnn');
  
  const statOvershoot = document.getElementById('stat-overshoot');
  const statSettling  = document.getElementById('stat-settling');
  const statDamping   = document.getElementById('stat-damping');

  if (!trmsChartInstance) return;

  if (type === 'pd') {
    btnPd.className = "w-full text-left p-4 rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400 transition-all font-mono text-xs";
    btnFnn.className = "w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all font-mono text-xs";
    
    statOvershoot.innerHTML = "Peak 0.60 rad (50%)";
    statSettling.innerHTML  = "45.0 seconds";
    statDamping.innerHTML   = "Underdamped";
    
    trmsChartInstance.data.datasets[0].label = 'Baseline PD Response';
    trmsChartInstance.data.datasets[0].data = [0.0, 0.4, 0.6, 0.45, 0.32, 0.28, 0.25, 0.22, 0.21, 0.20];
    trmsChartInstance.data.datasets[0].borderColor = '#f59e0b';
    trmsChartInstance.data.datasets[0].backgroundColor = 'rgba(245, 158, 11, 0.1)';
    trmsChartInstance.update();

  } else {
    btnFnn.className = "w-full text-left p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/20 text-cyan-400 transition-all font-mono text-xs";
    btnPd.className = "w-full text-left p-4 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-all font-mono text-xs";
    
    statOvershoot.innerHTML = "48.5% Error Reduction";
    statSettling.innerHTML  = "12.5 seconds";
    statDamping.innerHTML   = "Critically Damped";
    
    trmsChartInstance.data.datasets[0].label = 'Optimised IT2-FNN Response';
    trmsChartInstance.data.datasets[0].data = [0.0, 0.15, 0.19, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20, 0.20];
    trmsChartInstance.data.datasets[0].borderColor = '#06b6d4'; 
    trmsChartInstance.data.datasets[0].backgroundColor = 'rgba(6, 182, 212, 0.1)';
    trmsChartInstance.update();
  }
}


// ==========================================
// 2. MODAL REPORT POPUPS LOGIC (FOR ALL PROJECTS)
// ==========================================
const projectReports = {
  trms: `
    <div class="space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <span class="text-xs font-mono text-cyan-400">Full Case Study &mdash; Control Systems</span>
        <h2 class="text-2xl font-bold text-white mt-1">Twin Rotor MIMO System Adaptive FNN Control</h2>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-mono text-cyan-400 font-bold uppercase">1. Problem Formulation &amp; Non-Linear Dynamics</h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          The TRMS mimics helicopter flight dynamics across Pitch and Yaw axes. Strong cross-coupling forces introduce severe cross-axis aerodynamic reaction torques.
        </p>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-mono text-cyan-400 font-bold uppercase">2. IT2-FNN Controller Design</h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          An Interval Type-2 Fuzzy Neural Network was coded to dynamically adjust scaling factors for proportional and derivative gains online, eliminating non-linear overshoot.
        </p>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-mono text-cyan-400 font-bold uppercase">3. Quantitative Outcomes</h3>
        <ul class="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono">
          <li><strong>Pitch Overshoot:</strong> Reduced from 50% (0.60 rad) to 0.0% (Critically Damped).</li>
          <li><strong>Error Tracking:</strong> 48.5% total error reduction under square-wave trajectory demands.</li>
          <li><strong>Settling Time:</strong> Improved from 45.0 seconds to 12.5 seconds.</li>
        </ul>
      </div>
    </div>
  `,
  salford: `
    <div class="space-y-6">
      <div class="border-b border-slate-800 pb-4">
        <span class="text-xs font-mono text-cyan-400">Full Case Study &mdash; Formula Student</span>
        <h2 class="text-2xl font-bold text-white mt-1">Salford Racing &mdash; Chassis &amp; Suspension Dynamics</h2>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-mono text-cyan-400 font-bold uppercase">1. Competition Requirements</h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          Designed within strict Formula Student structural regulations. Primary target was optimizing torsional stiffness-to-weight ratio to improve cornering stability.
        </p>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-mono text-cyan-400 font-bold uppercase">2. Structural FEA &amp; Load Cases</h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          Applied high-stress boundary conditions in ANSYS, simulating peak load cases including 3G longitudinal braking and 2.5G lateral cornering.
        </p>
      </div>

      <div class="space-y-3">
        <h3 class="text-sm font-mono text-cyan-400 font-bold uppercase">3. Results &amp; Manufacturing</h3>
        <ul class="list-disc list-inside text-xs text-slate-300 space-y-1 font-mono">
          <li><strong>Minimum Factor of Safety:</strong> 1.65 achieved under maximum load vector.</li>
          <li><strong>Mass Optimization:</strong> Achieved an 11.5% mass reduction on suspension mounting tabs.</li>
          <li><strong>Compliance:</strong> Passed all technical inspection safety checks at competition.</li>
        </ul>
      </div>
    </div>
  `
};




function openReport(reportId) {
    // 1. Hide all modal contents
    const contents = document.querySelectorAll('.modal-content');
    contents.forEach(el => {
        el.classList.add('hidden');
        el.style.display = 'none';
    });

    // 2. Show the target modal content
    const target = document.getElementById('report-' + reportId);
    if (target) {
        target.classList.remove('hidden');
        target.style.display = 'block';
    } else {
        console.error("Could not find modal content with id: report-" + reportId);
    }

 
