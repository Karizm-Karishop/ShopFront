
import HelloSection from '../components/HelloSection/HelloSection';
import AlbumTrack from './AlbumTrack.page'
import BestSellers from './BestSellers.page';
import Categories from './Categories.page';
import Creatives from './Creatives.page';
import ShopsSection from './ShopsSection.page';
function Home() {

  return (
    <main>
      <div className="relative w-full bg-violeteBg h-auto p-2 lg:pl-10 lg:pr-10 lg:pt-10 lg:pb-0 md:pl-10 md:pt-10 md:pr-10 md:pb-0 ">
        <HelloSection />
      </div>
      <div className='w-full h-auto p-2 lg:pl-10 lg:pr-10 lg:pb-0 md:pl-10 md:pr-10 md:pb-0'>
       <ShopsSection/>
      </div>
      <div className='w-full h-auto p-2 lg:pl-10 lg:pr-10 lg:pb-0 md:pl-10 md:pr-10 md:pb-0'>
       <AlbumTrack/>
      </div>

      <div className='w-full h-auto p-2 lg:pl-10 lg:pr-10 lg:pb-0 md:pl-10 md:pr-10 md:pb-0'>
       <Creatives/>
      </div>
      <div className='w-full h-auto p-2 lg:pl-10 lg:pr-10 lg:pb-0 md:pl-10 md:pr-10 md:pb-0'>
       <Categories/>
      </div>
      <div className='w-full h-auto p-2 lg:pl-10 lg:pr-10 lg:pb-0 md:pl-10 md:pr-10 md:pb-0'>
       <BestSellers/>
      </div>
    </main>
  );
}
export default Home;
