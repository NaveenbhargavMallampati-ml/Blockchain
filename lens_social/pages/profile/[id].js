import { useRouter } from "next/router";
import { client , queryProfile , getPublications} from "../../api";
import {useState , useEffect } from 'react'
import Image from 'next/image';
import ABI from '../../abi.json'
import { ethers } from "ethers";

const address = '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
export default function Profile() 
{
    const router = useRouter()
    const {id} = router.query


    const [profile,setProfile] = useState()
    const [pub,setPub] = useState([])

    useEffect(()=>{
        if(id){
        fetchProfiles()
        }
      },[id])
    
    async function fetchProfiles()
    {
        try{
                const response = await client.query( queryProfile , {id}).toPromise()
                console.log('response ' , response)
                setProfile(response.data.profiles.items[0])
                const publications = await client.query( getPublications, {id}).toPromise()
                console.log('pubs' , publications)
                setPub(publications.data.publications.items)


        }
        catch(err){}
    }

    async function Follow()
    {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        const contract = new ethers.Contract(address,ABI,signer)

        try {
            const tx = await contract.follow([id],[0x0])
            await tx.wait()
            console.log("followed Successfully")
            
        } catch (error) {
            console.log({error})
            
        }
    }

    if(!profile) {return null}

    async function connect()
    {
        const account = await window.ethereum.request({
            method : "eth_requestAccounts"
        })
        console.log(account)
    }

    return(
        <div>
            <button onClick={connect}>Connect</button>
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
          <p> Followers {profile.stats.totalFollowers}</p>
          <p> Following {profile.stats.totalFollowing}</p>

          <div>
              {
                  pub.map((mpub,index) => (
                        <div style={{padding:'20px', borderTop:'1px solid #ededed'}}>
                            {
                                mpub.metadata.content
                            }
                        </div>
                  ))
              }
        
        <button onClick={Follow}>follow</button>
            
        </div>

        </div>
        
    )
}