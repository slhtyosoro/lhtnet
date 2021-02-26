const lhtnet = {
    importMode: 'browser'
}

import BinaryType from './core/binary/BinaryType'
import Protocol from './core/protocol/Protocol'
import EntityProtocol from './core/protocol/EntityProtocol'
import LocalEventProtocol from './core/protocol/LocalEventProtocol'
import MessageProtocol from './core/protocol/MessageProtocol'
import CommandProtocol from './core/protocol/CommandProtocol'
import Client from './core/client/Client'
import Interpolator from './core/client/Interpolator'
import proxify from './core/protocol/proxify'

// shortcuts for less typing
lhtnet.Boolean   = BinaryType.Boolean
lhtnet.Int2      = BinaryType.Int2
lhtnet.UInt2     = BinaryType.UInt2
lhtnet.Int3      = BinaryType.Int3
lhtnet.UInt3     = BinaryType.UInt3
lhtnet.Int4      = BinaryType.Int4
lhtnet.UInt4     = BinaryType.UInt4
lhtnet.Int6      = BinaryType.Int6
lhtnet.UInt6     = BinaryType.UInt6
lhtnet.Int8      = BinaryType.Int8
lhtnet.UInt8     = BinaryType.UInt8
lhtnet.Int10     = BinaryType.Int10
lhtnet.UInt10    = BinaryType.UInt10
lhtnet.Int12     = BinaryType.Int12
lhtnet.UInt12    = BinaryType.UInt12
lhtnet.Int16     = BinaryType.Int16
lhtnet.UInt16    = BinaryType.UInt16
lhtnet.Int32     = BinaryType.Int32
lhtnet.UInt32    = BinaryType.UInt32
lhtnet.Float32   = BinaryType.Float32
lhtnet.Number = 
lhtnet.Float64   = BinaryType.Float64
lhtnet.EntityId  = BinaryType.EntityId
lhtnet.RGB888    = BinaryType.RGB888
lhtnet.RotationFloat32 = BinaryType.RotationFloat32
lhtnet.ASCIIString    = BinaryType.ASCIIString
lhtnet.String =
lhtnet.UTF8String = BinaryType.UTF8String

lhtnet.Basic =
lhtnet.Basic =
lhtnet.Protocol = Protocol

lhtnet.Entity =
lhtnet.EntityProtocol = EntityProtocol

lhtnet.LEvent =
lhtnet.LocalEventProtocol = LocalEventProtocol

lhtnet.Msg =
lhtnet.Message =
lhtnet.MessageProtocol = MessageProtocol

lhtnet.Command =
lhtnet.CommandProtocol = CommandProtocol

lhtnet.proxify = proxify

// browser
lhtnet.Client = Client
lhtnet.Interpolator = Interpolator

export default lhtnet
