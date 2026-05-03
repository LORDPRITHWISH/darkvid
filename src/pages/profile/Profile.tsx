import { useParams } from 'react-router';

function Profile() {
  const { userid } = useParams();
  return (
    <div>Profile</div>
  )
}

export default Profile