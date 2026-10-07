import {
  MdAutoAwesome,
  MdBloodtype,
  MdBlurOn,
  MdCompress,
  MdFace,
  MdFaceRetouchingNatural,
  MdFilterDrama,
  MdFlashOn,
  MdGridOn,
  MdHealing,
  MdMedicalServices,
  MdMedication,
  MdOutlineFaceRetouchingNatural,
  MdOutlineHealthAndSafety,
  MdPalette,
  MdScience,
  MdSpa,
  MdVaccines,
  MdWaterDrop,
  MdWbSunny,
} from 'react-icons/md'
import { GiBeard, GiHairStrands, GiLaserBlast } from 'react-icons/gi'

const iconMap = {
  MdAutoAwesome,
  MdBloodtype,
  MdBlurOn,
  MdCompress,
  MdFace,
  MdFaceRetouchingNatural,
  MdFilterDrama,
  MdFlashOn,
  MdGridOn,
  MdHealing,
  MdMedication,
  MdOutlineFaceRetouchingNatural,
  MdOutlineHealthAndSafety,
  MdPalette,
  MdScience,
  MdSpa,
  MdVaccines,
  MdWaterDrop,
  MdWbSunny,
  GiBeard,
  GiHairStrands,
  GiLaserBlast,
}

export default function ServiceIcon({ name, className = 'w-8 h-8' }) {
  const Icon = iconMap[name] || MdMedicalServices
  return <Icon className={className} aria-hidden="true" />
}