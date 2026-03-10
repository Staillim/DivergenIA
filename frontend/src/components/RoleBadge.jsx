import { FiAward, FiStar, FiEye } from 'react-icons/fi'
import '../styles/role-badge.css'

function RoleBadge({ role, size = 'md', showText = true }) {
  const roleConfig = {
    administrador: {
      icon: FiAward,
      text: 'Administrador',
      color: '#FFD700',
      bgColor: 'rgba(255, 215, 0, 0.1)',
      borderColor: 'rgba(255, 215, 0, 0.3)'
    },
    miembro: {
      icon: FiStar,
      text: 'Miembro',
      color: '#0099FF',
      bgColor: 'rgba(0, 153, 255, 0.1)',
      borderColor: 'rgba(0, 153, 255, 0.3)'
    },
    visitante: {
      icon: FiEye,
      text: 'Visitante',
      color: '#888',
      bgColor: 'rgba(136, 136, 136, 0.1)',
      borderColor: 'rgba(136, 136, 136, 0.3)'
    }
  }

  const config = roleConfig[role] || roleConfig.visitante
  const Icon = config.icon

  const sizeMap = {
    sm: { icon: 14, text: 12, padding: '4px 8px' },
    md: { icon: 16, text: 14, padding: '6px 12px' },
    lg: { icon: 18, text: 16, padding: '8px 16px' }
  }

  const sizing = sizeMap[size] || sizeMap.md

  return (
    <div 
      className={`role-badge role-${role} size-${size}`}
      style={{
        '--badge-color': config.color,
        '--badge-bg': config.bgColor,
        '--badge-border': config.borderColor,
        padding: sizing.padding
      }}
    >
      <Icon size={sizing.icon} />
      {showText && <span style={{ fontSize: sizing.text }}>{config.text}</span>}
    </div>
  )
}

export default RoleBadge
