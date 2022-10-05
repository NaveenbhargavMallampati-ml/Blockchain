import { useState, useEffect } from 'react';

import { client , recommendedProfiles } from "../api";
import Link from 'next/link';
import Image from 'next/image';


export default function Home() 
{
  const [profiles,setprofiles] = useState([])
  useEffect(()=>{
    fetchProfiles()
  },[])

async function fetchProfiles() 
{
  try 
  {
      const response = await client.query(recommendedProfiles).toPromise();
      setprofiles(response.data.recommendedProfiles)
      console.log({response})
  }
  catch(err)
  {
    console.log({})
  }
  
}
return (
  <div>
    {
      profiles.map((profile,index)=>(
        <Link href={`/profile/${profile.id}`} key = {index}>
        <a>
        <div>
          {
            profile.picture ? (
             profile.picture.original ? 
              (<Image  src={profile.picture.original.url} width = '50px' height='60px' />)
              //: (<Image  src={profile.picture.url} width = '60px' height='60px' />)
               :(
                <div><p>No picture</p></div>)
            ) :(
              <div style={{width : '60px',height : '60px',backgroundColor:'black'}}/>
            )
          }
          <h4>
            {profile.handle}
          </h4>   
          <p>{profile.bio}</p>
        </div>
        </a>
        </Link>
      ))
    }
  </div>
)
}
