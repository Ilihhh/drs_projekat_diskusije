import Swal from 'sweetalert2';

// Napravimo prilagođenu instancu
const BlackSwal = Swal.mixin({
  background: '#2a2a2a',
  color: '#ffffff',
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
});

export default BlackSwal;